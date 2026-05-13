import bcrypt from 'bcryptjs';
import { Product } from '../models/Product.js';
import { Seller } from '../models/Seller.js';
import { AppError } from '../utils/AppError.js';
import { httpStatus } from '../utils/httpStatus.js';

export interface CreateSellerInput {
  name: string;
  profileImage: string;
  gender: 'male' | 'female' | 'others';
  email: string;
  mobileNo: string;
  country: string;
  state: string;
  skills: string[];
  password: string;
}

interface PaginationInput {
  page: number;
  limit: number;
}

const sellerProjection = '-passwordHash -__v';

export const createSeller = async (input: CreateSellerInput) => {
  const skills = [...new Set(input.skills.map((skill) => skill.trim()).filter(Boolean))];

  if (skills.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'At least one skill is required');
  }

  const existingSeller = await Seller.findOne({
    $or: [{ email: input.email }, { mobileNo: input.mobileNo }]
  });

  if (existingSeller) {
    const field = existingSeller.email === input.email ? 'Email' : 'Mobile number';
    throw new AppError(httpStatus.CONFLICT, `${field} already exists`);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const seller = await Seller.create({
    ...input,
    skills,
    passwordHash,
    role: 'seller'
  });

  return Seller.findById(seller._id).select(sellerProjection);
};

export const listSellers = async ({ page, limit }: PaginationInput) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Seller.find().select(sellerProjection).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Seller.countDocuments()
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

export const deleteSeller = async (sellerId: string): Promise<void> => {
  const seller = await Seller.exists({ _id: sellerId });

  if (!seller) {
    throw new AppError(httpStatus.NOT_FOUND, 'Seller not found');
  }

  await Product.deleteMany({ sellerId });

  const deleteResult = await Seller.deleteOne({ _id: sellerId });

  if (deleteResult.deletedCount === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'Seller not found');
  }
};
