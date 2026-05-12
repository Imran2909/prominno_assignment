import type { Request, Response } from 'express';
import { createSeller, listSellers } from '../services/seller.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { httpStatus } from '../utils/httpStatus.js';

export const createSellerController = async (req: Request, res: Response): Promise<void> => {
  const seller = await createSeller(req.body);
  sendSuccess(res, httpStatus.CREATED, 'Seller created successfully', seller);
};

export const listSellersController = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.validatedQuery?.page ?? 1);
  const limit = Number(req.validatedQuery?.limit ?? 10);
  const data = await listSellers({ page, limit });
  sendSuccess(res, httpStatus.OK, 'Sellers fetched successfully', data);
};
