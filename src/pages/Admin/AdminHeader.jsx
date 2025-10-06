import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../components/store/useUserStore";
import useCartStore from "../../components/store/useCartStore";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function AdminHeader() {
  const navigate = useNavigate();
  const { username, token, clearUser } = useUserStore();
  const { clearCart } = useCartStore();
  const [sold, setSold] = useState(0);

  useEffect(() => {
    let on = true;
    if (!token) return;
    fetch(`${API_BASE}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => (r.ok ? r.json() : []))
      .then(orders => {
        if (!on || !Array.isArray(orders)) return;
        const total = orders.reduce((s, o) => s + (o.items || []).reduce((a, it) => a + (it.qty || 0), 0), 0);
        setSold(total);
      })
      .catch(() => {});
    return () => { on = false; };
  }, [token]);

  const handleLogout = () => {
    clearUser();
    clearCart();
    navigate("/login", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 bg-black rounded-sm" />
          <span className="font-semibold">Tapako Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-gray-500">Products sold</span>
            <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-md bg-[#0b1424] text-white text-xs font-semibold">
              {sold}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Hi, {username}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
