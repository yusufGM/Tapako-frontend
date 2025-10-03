import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminHeader />
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 py-6">
        <aside className="col-span-12 md:col-span-3 lg:col-span-3">
          <div className="rounded-2xl bg-slate-900 p-3 text-slate-100">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Menu</div>
            <ul className="space-y-1">
              <li><a className="block rounded-xl bg-white/10 px-3 py-2" href="/admin/dashboard">Dashboard</a></li>
              <li><a className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/admin/orders">Orders</a></li>
              <li><a className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/admin/products">Products</a></li>
            </ul>
          </div>
        </aside>
        <main className="col-span-12 md:col-span-9 lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
