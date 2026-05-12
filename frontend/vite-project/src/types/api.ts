export type Role = 'admin' | 'seller';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  profileImage?: string;
}

export interface LoginResult {
  accessToken: string;
  user: AuthUser;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}

export interface Seller {
  _id: string;
  name: string;
  profileImage: string;
  gender: 'male' | 'female' | 'others';
  email: string;
  mobileNo: string;
  country: string;
  state: string;
  skills: string[];
  role: 'seller';
  createdAt: string;
}

export interface Brand {
  _id?: string;
  brandName: string;
  detail: string;
  image: string;
  price: number;
}

export interface Product {
  _id: string;
  sellerId: string | Pick<Seller, '_id' | 'name' | 'email' | 'mobileNo'> | null;
  productName: string;
  productDescription: string;
  brands: Brand[];
  createdAt: string;
}
