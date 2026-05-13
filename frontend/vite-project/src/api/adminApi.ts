import { apiClient, unwrapApiData } from './client';
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
  return unwrapApiData(response);
};

export const getSellers = async (page: number, limit: number): Promise<PaginatedResult<Seller>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResult<Seller>>>('/admin/sellers', {
    params: { page, limit }
  });
  return unwrapApiData(response);
};

export const deleteSeller = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/sellers/${id}`);
};

export const getAdminProducts = async (page: number, limit: number): Promise<PaginatedResult<Product>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResult<Product>>>('/admin/products', {
    params: { page, limit }
  });
  return unwrapApiData(response);
};

export const downloadAdminProductPdf = async (id: string): Promise<Blob> => {
  const response = await apiClient.get(`/admin/products/${id}/pdf`, {
    responseType: 'blob'
  });

  return response.data as Blob;
};
