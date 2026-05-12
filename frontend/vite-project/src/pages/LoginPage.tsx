import { type FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { loginAdmin, loginSeller } from '../api/authApi';
import { getErrorMessage } from '../api/client';
import type { Role } from '../types/api';
import { authStorage } from '../utils/authStorage';

interface LoginPageProps {
  role: Role;
}

export function LoginPage({ role }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(role === 'admin' ? 'admin@prominno.com' : '');
  const [password, setPassword] = useState(role === 'admin' ? 'Admin@12345' : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAdmin = role === 'admin';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = isAdmin ? await loginAdmin({ email, password }) : await loginSeller({ email, password });
      authStorage.setSession(result.accessToken, result.user);
      toast.success(`${result.user.role} login successful`);
      navigate(isAdmin ? '/admin/sellers' : '/seller/products', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">{isAdmin ? 'Admin Portal' : 'Seller Portal'}</span>
          <h1>{isAdmin ? 'Admin Login' : 'Seller Login'}</h1>
          <p>Sign in to manage {isAdmin ? 'sellers' : 'your products'}.</p>
        </div>

        <label className="field">
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            minLength={6}
            required
          />
        </label>

        <button type="submit" className="primary-button wide" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>

        <Link to={isAdmin ? '/seller/login' : '/admin/login'} className="switch-link">
          {isAdmin ? 'Go to seller login' : 'Go to admin login'}
        </Link>
      </form>
    </main>
  );
}
