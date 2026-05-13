import axios, { type AxiosResponse } from 'axios';
import { authStorage } from '../utils/authStorage';
import type { ApiResponse } from '../types/api';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;

      if (responseData instanceof Blob && responseData.type.includes('application/json')) {
        try {
          error.response!.data = JSON.parse(await responseData.text()) as unknown;
        } catch {
          error.response!.data = { message: 'Unable to read server error response' };
        }
      }

      if (error.response?.status === 401) {
        authStorage.clear();
      }
    }

    return Promise.reject(error);
  }
);

export const unwrapApiData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  const body = response.data;

  if (!body?.success || body.data === undefined || body.data === null) {
    throw new Error(body?.message ?? 'Invalid server response');
  }

  return body.data;
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: string[] } | undefined;
    const validationMessage = Array.isArray(data?.errors) ? data.errors[0] : undefined;

    if (validationMessage) {
      return validationMessage;
    }

    if (data?.message) {
      return data.message;
    }

    if (error.code === 'ERR_NETWORK') {
      return 'Unable to reach the server. Please check that the backend is running.';
    }

    return error.message || 'Something went wrong';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};
