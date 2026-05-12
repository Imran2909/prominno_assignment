import type { Request, Response } from 'express';
import { loginAdmin, loginSeller } from '../services/auth.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { httpStatus } from '../utils/httpStatus.js';

export const adminLoginController = async (req: Request, res: Response): Promise<void> => {
  const data = await loginAdmin(req.body);
  sendSuccess(res, httpStatus.OK, 'Admin login successful', data);
};

export const sellerLoginController = async (req: Request, res: Response): Promise<void> => {
  const data = await loginSeller(req.body);
  sendSuccess(res, httpStatus.OK, 'Seller login successful', data);
};
