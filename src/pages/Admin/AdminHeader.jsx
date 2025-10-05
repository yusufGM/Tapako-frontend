import { NavLink, Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";

function MenuLink({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block w-full text-left px-4 py-2 rounded-lg transition ${
          isActive ? "bg-white/10 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="pt-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[288px_1fr] gap-6 items-start">
          <aside className="md:sticky md:top-24 md:h-[calc(100vh-7rem)] md:w-72 shrink-0">
            <div className="bg-[#0b1424] text-white rounded-2xl p-4 h-full overflow-y-auto">
              <div className="text-xs uppercase tracking-widest text-gray-400 px-2 mb-2">Menu</div>
              <div className="space-y-2">
                <MenuLink to="/admin/dashboard" end>Dashboard</MenuLink>
                <MenuLink to="/admin/orders" end>Orders</MenuLink>
                <MenuLink to="/admin/products" end>Products</MenuLink>
              </div>
            </div>
          </aside>

          <main className="pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
