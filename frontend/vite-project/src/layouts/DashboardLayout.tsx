import { useEffect, useRef, useState } from 'react';
import { Box, LogOut, Package, Users } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authStorage } from '../utils/authStorage';

const dummyAvatar =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="%23e7edf5"/><circle cx="40" cy="31" r="14" fill="%2394a3b8"/><path d="M16 70c4-17 16-25 24-25s20 8 24 25" fill="%2394a3b8"/></svg>';

export function DashboardLayout() {
  const navigate = useNavigate();
  const user = authStorage.getUser();
  const isAdmin = user?.role === 'admin';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const avatarSrc = user?.profileImage || dummyAvatar;

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent): void => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  const handleLogout = (): void => {
    authStorage.clear();
    navigate(isAdmin ? '/admin/login' : '/seller/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark">LOGO</div>
        <div className="topbar-user" ref={menuRef}>
          <button
            type="button"
            className="avatar-button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Open user menu"
            aria-expanded={isMenuOpen}
          >
            <img src={avatarSrc} alt={user?.name ?? 'User'} />
          </button>
          {isMenuOpen && (
            <div className="user-menu">
              <div>
                <strong>{user?.name ?? 'User'}</strong>
                <span>{user?.email}</span>
              </div>
              <button type="button" onClick={handleLogout}>
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <aside className="sidebar">
        {isAdmin ? (
          <>
            <NavLink to="/admin/sellers" className="sidebar-link">
              <Users size={16} />
              Users
            </NavLink>
            <NavLink to="/admin/products" className="sidebar-link">
              <Package size={16} />
              Product
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/seller/products" className="sidebar-link">
              <Package size={16} />
              Product
            </NavLink>
            <NavLink to="/seller/products/new" className="sidebar-link">
              <Box size={16} />
              Add Product
            </NavLink>
          </>
        )}
      </aside>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}
