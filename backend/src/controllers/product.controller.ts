import type { Request, Response } from 'express';
import { createProduct, deleteProduct, getProductPdf, listAllProducts, listProducts } from '../services/product.service.js';
import { AppError } from '../utils/AppError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { httpStatus } from '../utils/httpStatus.js';

const getSellerId = (req: Request): string => {
  if (!req.user?.id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  return req.user.id;
};

export const createProductController = async (req: Request, res: Response): Promise<void> => {
  const product = await createProduct(getSellerId(req), req.body);
  sendSuccess(res, httpStatus.CREATED, 'Product created successfully', product);
};

export const listProductsController = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.validatedQuery?.page ?? 1);
  const limit = Number(req.validatedQuery?.limit ?? 10);
  const data = await listProducts({ sellerId: getSellerId(req), page, limit });
  sendSuccess(res, httpStatus.OK, 'Products fetched successfully', data);
};

export const listAllProductsController = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.validatedQuery?.page ?? 1);
  const limit = Number(req.validatedQuery?.limit ?? 10);
  const data = await listAllProducts({ page, limit });
  sendSuccess(res, httpStatus.OK, 'Products fetched successfully', data);
};

export const deleteProductController = async (req: Request, res: Response): Promise<void> => {
  await deleteProduct(getSellerId(req), String(req.params.id));
  sendSuccess(res, httpStatus.OK, 'Product deleted successfully');
};

export const productPdfController = async (req: Request, res: Response): Promise<void> => {
  const productId = String(req.params.id);
  const pdfBuffer = await getProductPdf(getSellerId(req), productId);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="product-${productId}.pdf"`);
  res.status(httpStatus.OK).send(pdfBuffer);
};
