import { Navigate, Outlet } from 'react-router-dom';
import type { Role } from '../types/api';
import { authStorage } from '../utils/authStorage';

interface ProtectedRouteProps {
  role: Role;
}

export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const token = authStorage.getToken();
  const userRole = authStorage.getRole();

  if (!token || userRole !== role) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/seller/login'} replace />;
  }

  return <Outlet />;
}
