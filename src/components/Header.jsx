import { Link, useNavigate, useLocation } from 'react-router-dom';
import useCartStore from './store/useCartStore';
import useUserStore from './store/useUserStore';

const Header = () => {
  const { openDrawer, cart = [] } = useCartStore();
  const { token, username, clearUser, role } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  if (role === 'admin' && isAdminRoute) return null;

  const cartCount = cart.reduce((s, i) => s + (i.qty || 0), 0);
  const logout = () => { clearUser(); navigate('/'); };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6 md:px-12">
        <Link to="/" aria-label="TAPAK-O!" className="flex items-center">
          <svg className="h-16 w-auto text-black" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z" fill="currentColor" />
          </svg>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-gray-900 tracking-wide uppercase">
          <Link to="/store" className="hover:text-red-600 text-2xl md:text-3xl font-extrabold drop-shadow-xl">Store</Link>
          <Link to="/sale" className="hover:text-red-600 text-2xl md:text-3xl font-extrabold drop-shadow-xl">Sale</Link>
          {role === 'admin' && <Link to="/admin/dashboard" className="hover:text-red-600">Admin</Link>}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={openDrawer} aria-label="Cart" className="hover:text-red-600 relative">
            <svg className="h-16 w-6 extrabold stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
              <circle cx="7" cy="21" r="1" />
              <circle cx="17" cy="21" r="1" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>
            )}
          </button>

          {token ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-red-600">Hi, {username}</span>
              <button onClick={logout} className="hover:text-red-700 text-sm">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="text-2xl md:text-3xl font-extrabold drop-shadow-xl text-red-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
