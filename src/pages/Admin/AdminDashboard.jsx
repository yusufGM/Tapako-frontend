export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-500">Total Sales</div>
          <div className="text-3xl font-semibold mt-1">$15,230</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-500">Orders</div>
          <div className="text-3xl font-semibold mt-1">254</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-500">Products</div>
          <div className="text-3xl font-semibold mt-1">32</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-gray-500">Customers</div>
          <div className="text-3xl font-semibold mt-1">1,208</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border rounded-xl p-4 h-64">Sales Overview</div>
        <div className="border rounded-xl p-4 h-64">Customers</div>
      </div>
    </div>
  );
}
