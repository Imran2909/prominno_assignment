import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { Seller } from '../models/Seller.js';
import { AppError } from '../utils/AppError.js';
import { httpStatus } from '../utils/httpStatus.js';
import { signToken } from '../utils/jwt.js';

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'seller';
    profileImage?: string;
  };
}

export const loginAdmin = async ({ email, password }: LoginInput): Promise<AuthResult> => {
  const admin = await Admin.findOne({ email }).select('+passwordHash');

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid admin credentials');
  }

  const user = {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    role: 'admin' as const
  };

  return {
    accessToken: signToken({ id: user.id, email: user.email, role: user.role }),
    user
  };
};

export const loginSeller = async ({ email, password }: LoginInput): Promise<AuthResult> => {
  const seller = await Seller.findOne({ email }).select('+passwordHash');

  if (!seller || !(await bcrypt.compare(password, seller.passwordHash))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid seller credentials');
  }

  const user = {
    id: seller._id.toString(),
    name: seller.name,
    email: seller.email,
    role: 'seller' as const,
    profileImage: seller.profileImage
  };

  return {
    accessToken: signToken({ id: user.id, email: user.email, role: user.role }),
    user
  };
};
