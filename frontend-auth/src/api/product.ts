// src/api/product.ts
import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:3002/api/product';

interface Product {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  description?: string;
  categoryName?: string;
  imageLocalPath?: string;
}

export interface PaginatedResponse<T> {
  products: T[];
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    recordsPerPage: number;
  };
}

interface PagerDto {
  page: number;
  recordsPerPage: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar el token automáticamente
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get('/');
  return response.data.result;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await axiosInstance.get(`/${id}`);
  return response.data.result;
};

export const getPaginatedProducts = async (pager: PagerDto): Promise<any> => {
  const response = await axiosInstance.get('/all/paginated', {
    params: pager,
  });
  return response.data.result;
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  try {
    const response = await axiosInstance.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.result;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear el producto');
  }
};

export const updateProduct = async (
  id: number,
  formData: FormData
): Promise<Product> => {
  try {
    const response = await axiosInstance.put(`/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.result;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el producto');
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el producto');
  }
};