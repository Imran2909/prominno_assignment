import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminProductListPage } from './pages/AdminProductListPage';
import { LoginPage } from './pages/LoginPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { ProductListPage } from './pages/ProductListPage';
import { SellerFormPage } from './pages/SellerFormPage';
import { SellerListPage } from './pages/SellerListPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { authStorage } from './utils/authStorage';
import './styles/dashboard.css';

function App() {
  const role = authStorage.getRole();
  const fallbackPath = role === 'admin' ? '/admin/sellers' : role === 'seller' ? '/seller/products' : '/admin/login';

  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<LoginPage role="admin" />} />
        <Route path="/seller/login" element={<LoginPage role="seller" />} />

        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/sellers" element={<SellerListPage />} />
            <Route path="/admin/sellers/new" element={<SellerFormPage />} />
            <Route path="/admin/products" element={<AdminProductListPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="seller" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/seller/products" element={<ProductListPage />} />
            <Route path="/seller/products/new" element={<ProductFormPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={fallbackPath} replace />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
