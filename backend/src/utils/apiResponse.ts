import type { Response } from 'express';

interface ApiResponseBody<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): Response<ApiResponseBody<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};
