// src/api/coupon.ts
import axios from 'axios';
import { getToken, getUser } from '../utils/auth';

const API_URL = 'http://localhost:3003/api/coupon';

export interface Coupon {
  couponId?: number;
  couponCode: string;
  discountAmount: number;
  minAmount: number;
  lastUpdated: string | Date;
  amountType: 'Percentage' | 'Fixed';
  limitUser: number;
  dateInit: string | Date;
  dateEnd: string | Date;
  category: string;
  stateCoupon: boolean;
}

export interface ResponseDto<T> {
  isSuccess: boolean;
  message: string;
  result: T;
}

// Crear instancia de Axios con interceptor de token
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Verificar roles del usuario
const checkUserRoles = (requiredRoles: string[]) => {
  const user = getUser();
  return user?.roles?.some((role: string) => requiredRoles.includes(role));
};

// Obtener todos los cupones
export const getAllCoupons = async (): Promise<ResponseDto<Coupon[]>> => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener los cupones');
  }
};

// Obtener cupón por ID
export const getCouponById = async (id: number): Promise<ResponseDto<Coupon>> => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el cupón');
  }
};

// Obtener cupón por código
export const getCouponByCode = async (code: string): Promise<ResponseDto<Coupon>> => {
  try {
    const response = await axiosInstance.get(`/GetByCode/${code}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el cupón');
  }
};

// Crear nuevo cupón
export const createCoupon = async (coupon: Omit<Coupon, 'couponId'>): Promise<ResponseDto<Coupon>> => {
  try {
    if (!checkUserRoles(['ADMIN', 'VENTAS'])) {
      throw new Error('No tienes permisos para crear cupones');
    }
    const response = await axiosInstance.post('/', coupon);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear el cupón');
  }
};

// Actualizar cupón
export const updateCoupon = async (coupon: Coupon): Promise<ResponseDto<Coupon>> => {
  try {
    if (!checkUserRoles(['ADMIN'])) {
      throw new Error('No tienes permisos para actualizar cupones');
    }
    const response = await axiosInstance.put('/', coupon);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el cupón');
  }
};

// Eliminar cupón
export const deleteCoupon = async (id: number): Promise<ResponseDto<null>> => {
  try {
    if (!checkUserRoles(['ADMIN'])) {
      throw new Error('No tienes permisos para eliminar cupones');
    }
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el cupón');
  }
};