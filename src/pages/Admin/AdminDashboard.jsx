import { useEffect, useMemo, useState } from "react";
import useUserStore from "../../components/store/useUserStore";
import api, { apiGet } from "../../lib/api";

const formatIDR = (n = 0) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(Math.max(0, Number(n) || 0))
    .replace(/\s/g, "");

async function fetchAdminOrdersWithFallback(token) {
  const primary = `${api.baseURL}/admin/orders`;
  const legacy = `${api.baseURL.replace(/\/api$/, "")}/orders`;
  const headers = { Authorization: `Bearer ${token}` };
  let r = await fetch(primary, { headers });
  if (r.status === 404) r = await fetch(legacy, { headers });
  const data = await r.json().catch(() => []);
  if (!r.ok) throw new Error(data?.error || "Gagal memuat orders");
  return Array.isArray(data) ? data : [];
}

export default function AdminDashboard() {
  const { token } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const [recentProducts, setRecentProducts] = useState([]);
  const [registeredCustomers, setRegisteredCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const [ordersData, itemsData, usersStats] = await Promise.all([
        fetchAdminOrdersWithFallback(token),
        apiGet("/admin/items?page=1&limit=10&sort=updatedAt:desc", { headers: { Authorization: `Bearer ${token}` } }),
        apiGet("/admin/stats/customers", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setOrders(ordersData);
      setProductsTotal(itemsData?.total || 0);
      setRecentProducts(itemsData?.items || []);
      setRegisteredCustomers(usersStats?.totalUsers || 0);
    } catch (e) {
      setErr(e?.message || "Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const metrics = useMemo(() => {
    const totalSales = orders.reduce((s, o) => s + (o.total || 0), 0);
    return {
      totalSales,
      ordersCount: orders.length,
      productsCount: productsTotal,
      registeredCustomers
    };
  }, [orders, productsTotal, registeredCustomers]);

  const recentOrders = useMemo(() => {
    const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted.slice(0, 10);
  }, [orders]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {loading ? (
        <div className="border rounded-xl p-6 animate-pulse">Memuat…</div>
      ) : err ? (
        <div className="border rounded-xl p-6 text-red-600">{err}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-xl p-4">
              <div className="text-sm text-gray-500">Total Sales</div>
              <div className="text-3xl font-semibold mt-1">{formatIDR(metrics.totalSales)}</div>
            </div>
            <div className="border rounded-xl p-4">
              <div className="text-sm text-gray-500">Orders</div>
              <div className="text-3xl font-semibold mt-1">{metrics.ordersCount}</div>
            </div>
            <div className="border rounded-xl p-4">
              <div className="text-sm text-gray-500">Products</div>
              <div className="text-3xl font-semibold mt-1">{metrics.productsCount}</div>
            </div>
            <div className="border rounded-xl p-4">
              <div className="text-sm text-gray-500">Registered Customers</div>
              <div className="text-3xl font-semibold mt-1">{metrics.registeredCustomers}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border rounded-xl p-4">
              <div className="font-semibold mb-3">Recent Orders</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2">Waktu</th>
                      <th className="text-left p-2">User</th>
                      <th className="text-left p-2">Items</th>
                      <th className="text-right p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr><td colSpan={4} className="p-3 text-gray-600">Belum ada order</td></tr>
                    ) : recentOrders.map(o => (
                      <tr key={o._id} className="border-t">
                        <td className="p-2">{new Date(o.createdAt).toLocaleString("id-ID")}</td>
                        <td className="p-2">{o.username || "-"}</td>
                        <td className="p-2">{(o.items || []).map(it => `${it.name}×${it.qty}`).join(", ")}</td>
                        <td className="p-2 text-right font-semibold">{formatIDR(o.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <div className="font-semibold mb-3">Recently Updated Products</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Updated</th>
                      <th className="text-right p-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.length === 0 ? (
                      <tr><td colSpan={4} className="p-3 text-gray-600">Tidak ada produk</td></tr>
                    ) : recentProducts.map(p => (
                      <tr key={p._id} className="border-t">
                        <td className="p-2">{p.name}</td>
                        <td className="p-2">{p.category || "-"}</td>
                        <td className="p-2">{p.updatedAt ? new Date(p.updatedAt).toLocaleString("id-ID") : "-"}</td>
                        <td className="p-2 text-right">{formatIDR(p.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
