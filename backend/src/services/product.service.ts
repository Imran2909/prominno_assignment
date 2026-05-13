import { Product } from '../models/Product.js';
import { Seller } from '../models/Seller.js';
import { AppError } from '../utils/AppError.js';
import { httpStatus } from '../utils/httpStatus.js';
import { createProductPdf } from './pdf.service.js';

export interface BrandInput {
  brandName: string;
  detail: string;
  image: string;
  price: number;
}

export interface CreateProductInput {
  productName: string;
  productDescription: string;
  brands: BrandInput[];
}

interface SellerProductPaginationInput {
  sellerId: string;
  page: number;
  limit: number;
}

interface PaginationInput {
  page: number;
  limit: number;
}

const ensureSellerExists = async (sellerId: string): Promise<void> => {
  const sellerExists = await Seller.exists({ _id: sellerId });

  if (!sellerExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Seller account no longer exists');
  }
};

export const createProduct = async (sellerId: string, input: CreateProductInput) => {
  await ensureSellerExists(sellerId);

  return Product.create({
    sellerId,
    ...input
  });
};

export const listProducts = async ({ sellerId, page, limit }: SellerProductPaginationInput) => {
  await ensureSellerExists(sellerId);

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Product.find({ sellerId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments({ sellerId })
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};

export const listAllProducts = async ({ page, limit }: PaginationInput) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Product.find()
      .populate('sellerId', 'name email mobileNo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments()
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};

export const deleteProduct = async (sellerId: string, productId: string): Promise<void> => {
  await ensureSellerExists(sellerId);

  const product = await Product.findOneAndDelete({ _id: productId, sellerId });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }
};

export const getProductPdf = async (sellerId: string, productId: string) => {
  await ensureSellerExists(sellerId);

  const product = await Product.findOne({ _id: productId, sellerId });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return createProductPdf(product);
};

export const getAdminProductPdf = async (productId: string) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return createProductPdf(product);
};
