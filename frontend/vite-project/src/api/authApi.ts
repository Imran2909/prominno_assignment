import { apiClient, unwrapApiData } from './client';
import type { ApiResponse, LoginResult } from '../types/api';

interface LoginPayload {
  email: string;
  password: string;
}

export const loginAdmin = async (payload: LoginPayload): Promise<LoginResult> => {
  const response = await apiClient.post<ApiResponse<LoginResult>>('/auth/admin/login', payload);
  return unwrapApiData(response);
};

export const loginSeller = async (payload: LoginPayload): Promise<LoginResult> => {
  const response = await apiClient.post<ApiResponse<LoginResult>>('/auth/seller/login', payload);
  return unwrapApiData(response);
};
