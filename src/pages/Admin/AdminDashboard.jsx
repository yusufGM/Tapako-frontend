import AdminLayout from "./AdminLayout";

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total Sales" value="$15,230" />
        <Stat label="Orders" value="254" />
        <Stat label="Products" value="32" />
        <Stat label="Customers" value="1,208" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Sales Overview</h2>
          <div className="h-64 grid place-items-center text-slate-400">
            <span>Chart placeholder</span>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Customers</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Sales</span>
              <span>2.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Products</span>
              <span>32</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Customers</span>
              <span>1,208</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
