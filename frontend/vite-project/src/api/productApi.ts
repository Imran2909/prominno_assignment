import { apiClient, unwrapApiData } from './client';
import type { ApiResponse, Brand, PaginatedResult, Product } from '../types/api';

export interface CreateProductPayload {
  productName: string;
  productDescription: string;
  brands: Brand[];
}

export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
  const response = await apiClient.post<ApiResponse<Product>>('/seller/products', payload);
  return unwrapApiData(response);
};

export const getProducts = async (page: number, limit: number): Promise<PaginatedResult<Product>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResult<Product>>>('/seller/products', {
    params: { page, limit }
  });
  return unwrapApiData(response);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/seller/products/${id}`);
};

export const downloadProductPdf = async (id: string): Promise<Blob> => {
  const response = await apiClient.get(`/seller/products/${id}/pdf`, {
    responseType: 'blob'
  });

  return response.data as Blob;
};
