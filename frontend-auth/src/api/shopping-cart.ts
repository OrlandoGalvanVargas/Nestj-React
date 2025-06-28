// src/api/shopping-cart.ts
import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:3004/api/cart';

// Interfaces basadas en tu backend
export interface CartHeaderDto {
  cartHeaderId?: number;
  userId: string;
  couponCode?: string;
    stock?: number;  // Falta en tu interfaz actual

  cartTotal?: number;
  discount?: number;
    imageLocalPath?: string;  // Añadir esta propiedad opcional

}

export interface ProductDto {
  productId: number;
  name: string;
  price: number;
    stock?: number;  // Mover stock aquí desde CartHeaderDto
  description: string;
  categoryName: string;
  imageUrl: string;
    imageLocalPath?: string;  // Mover aquí si es necesario

}

export interface CartDetailsDto {
  cartDetailsId?: number;
  cartHeaderId?: number;
  productId: number;
  productDto?: ProductDto;
  count: number;
}

export interface CartDto {
  cartHeader?: CartHeaderDto;
cartDetailsDtos?: CartDetailsDto[];  // Hacer opcional
  cartDetailDto?: CartDetailsDto[];    // Añadir esta línea si el backend usa este nombre
  
}

export interface ResponseDto<T> {
  isSuccess: boolean;
  message: string;
  result: T;
}

// Configuración de Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token JWT
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Aplica un cupón al carrito de compras
 * @param userId ID del usuario
 * @param couponCode Código del cupón a aplicar
 */
export const applyCoupon = async (
  userId: string,
  couponCode: string
): Promise<ResponseDto<boolean>> => {
  try {
    const response = await axiosInstance.post<ResponseDto<boolean>>('/ApplyCoupon', {
      cartHeader: {
        userId,
        couponCode,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Error al aplicar el cupón'
    );
  }
};

/**
 * Remueve un cupón del carrito de compras
 * @param userId ID del usuario
 */
export const removeCoupon = async (
  userId: string
): Promise<ResponseDto<boolean>> => {
  try {
    const response = await axiosInstance.post<ResponseDto<boolean>>('/RemoveCoupon', {
      cartHeader: {
        userId,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Error al remover el cupón'
    );
  }
};

/**
 * Obtiene el carrito de compras de un usuario
 * @param userId ID del usuario
 */
export const getCart = async (
  userId: string
): Promise<ResponseDto<CartDto>> => {
  try {
    const response = await axiosInstance.get<ResponseDto<CartDto>>(
      `/GetCart/${userId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Error al obtener el carrito'
    );
  }
};

/**
 * Agrega o actualiza un producto en el carrito
 * @param userId ID del usuario
 * @param productId ID del producto
 * @param count Cantidad a agregar (positivo) o quitar (negativo)
 */
export const cartUpsert = async (
  userId: string,
  productId: number,
  count: number
): Promise<ResponseDto<CartDto>> => {
  try {
    const response = await axiosInstance.post<any>('/CartUpsert', {
      cartHeader: {
        userId,
      },
      cartDetailsDtos: [
        {
          productId,
          count,
        },
      ],
    });

    // Caso 1: La respuesta exitosa tiene solo 'result' (sin isSuccess)
    if (response.data.result && !response.data.hasOwnProperty('isSuccess')) {
      return {
        isSuccess: true,
        message: 'Producto agregado al carrito exitosamente',
        result: response.data.result
      };
    }
    // Caso 2: La respuesta tiene isSuccess = true
    else if (response.data.isSuccess === true) {
      return {
        isSuccess: true,
        message: response.data.message || 'Producto agregado al carrito exitosamente',
        result: response.data.result
      };
    }
    // Caso 3: La respuesta tiene isSuccess = false (error)
    else if (response.data.isSuccess === false) {
      return {
        isSuccess: false,
        message: response.data.message || 'Error al agregar al carrito',
        result: null as any
      };
    }
    // Caso 4: Formato inesperado - tratar como exitoso si tiene las propiedades de CartDto
    else if (response.data.cartHeader && response.data.cartDetailsDtos) {
      return {
        isSuccess: true,
        message: 'Producto agregado al carrito exitosamente',
        result: response.data as CartDto
      };
    }
    // Caso 5: Formato completamente inesperado
    else {
      throw new Error('Formato de respuesta inesperado del servidor');
    }
  } catch (error: any) {
    // Si el error viene del servidor con formato específico
    if (error.response?.data?.isSuccess === false) {
      return {
        isSuccess: false,
        message: error.response.data.message || 'Error al actualizar el carrito',
        result: null as any
      };
    }
    
    // Error genérico
    throw new Error(
      error.response?.data?.message || 'Error al actualizar el carrito'
    );
  }
};

/**
 * Elimina un producto del carrito (reduce cantidad o elimina completamente)
 * @param cartDetailsId ID del detalle del carrito a eliminar
 */
export const removeCartItem = async (
  cartDetailsId: number
): Promise<ResponseDto<boolean>> => {
  try {
    const response = await axiosInstance.post<ResponseDto<boolean>>('/RemoveCart', {
      cartDetailsId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Error al eliminar el producto del carrito'
    );
  }
};

export const removeCartItemCompletely = async (
  cartDetailsId: number
): Promise<ResponseDto<boolean>> => {
  try {
    const response = await axiosInstance.post<ResponseDto<boolean>>('/RemoveCartItem', {
      cartDetailsId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Error al eliminar el producto del carrito'
    );
  }
};

// Exportar todos los tipos para uso externo
export type {
  CartHeaderDto as CartHeader,
  CartDetailsDto as CartItem,
  ProductDto as Product,
  CartDto as ShoppingCart,
};