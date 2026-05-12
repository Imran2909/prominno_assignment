import { apiClient } from './client';
import type { ApiResponse, PaginatedResult, Product, Seller } from '../types/api';

export interface CreateSellerPayload {
  name: string;
  profileImage: string;
  gender: 'male' | 'female' | 'others';
  email: string;
  mobileNo: string;
  country: string;
  state: string;
  skills: string[];
  password: string;
  confirmPassword: string;
}

export const createSeller = async (payload: CreateSellerPayload): Promise<Seller> => {
  const response = await apiClient.post<ApiResponse<Seller>>('/admin/sellers', payload);
  return response.data.data;
};

export const getSellers = async (page: number, limit: number): Promise<PaginatedResult<Seller>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResult<Seller>>>('/admin/sellers', {
    params: { page, limit }
  });
  return response.data.data;
};

export const getAdminProducts = async (page: number, limit: number): Promise<PaginatedResult<Product>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResult<Product>>>('/admin/products', {
    params: { page, limit }
  });
  return response.data.data;
};
