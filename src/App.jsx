import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import useUserStore from './components/store/useUserStore.js';
import useCartStore from './components/store/useCartStore.js';
import ScrollToTop from './components/ui/ScrollToTop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import { Toaster } from 'sonner';

const SuccessPage = lazy(() => import('./pages/SuccessPage.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const SignUp = lazy(() => import('./pages/SignUp.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const StorePage = lazy(() => import('./pages/StorePage.jsx'));
const SalePage = lazy(() => import('./pages/SalePage.jsx'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard.jsx'));

function PrivateRoute({ children }) {
  const { token } = useUserStore();
  return token ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { token, role } = useUserStore();
  const isAdmin = role === 'admin';
  return token && isAdmin ? children : <Navigate to="/login" />;
}

const Spinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="animate-spin rounded-full h-10 w-10 border border-gray-300 border-t-gray-900" />
  </div>
);

export default function App() {
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  useEffect(() => {
    closeDrawer();
  }, [closeDrawer]);

  return (
    <Suspense fallback={<Spinner />}>
      <ScrollToTop />
      {!isAdminRoute && <Header className="sticky top-0 z-50 isolate" />}
      {!isAdminRoute && <CartDrawer />}

      <div className={isAdminRoute ? 'min-h-screen' : 'min-h-screen pt-24'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            }
          />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/sale" element={<SalePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
      <Toaster position="top-center" richColors closeButton />
    </Suspense>
  );
}
