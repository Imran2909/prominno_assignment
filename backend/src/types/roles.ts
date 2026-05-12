export type UserRole = 'admin' | 'seller';

export interface AuthPayload {
  id: string;
  role: UserRole;
  email: string;
}
