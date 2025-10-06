import { useEffect, useState } from "react";
import useUserStore from "../../components/store/useUserStore";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const formatIDR = (n = 0) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(Math.max(0, Number(n) || 0))
    .replace(/\s/g, "");

export default function AdminOrders() {
  const { token } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let on = true;
    setLoading(true);
    setErr(null);
    fetch(`${API_BASE}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        const data = await r.json().catch(() => []);
        if (!r.ok) throw new Error(data?.error || "Gagal memuat orders");
        if (on) setOrders(Array.isArray(data) ? data : []);
      })
      .catch((e) => on && setErr(e.message))
      .finally(() => on && setLoading(false));
    return () => { on = false; };
  }, [token]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Orders</h2>

      {loading ? (
        <div className="border rounded-xl p-6 animate-pulse">Memuat…</div>
      ) : err ? (
        <div className="border rounded-xl p-6 text-red-600">{err}</div>
      ) : orders.length === 0 ? (
        <div className="border rounded-xl p-6 text-gray-600">Belum ada order.</div>
      ) : (
        <div className="border rounded-xl overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Waktu</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Alamat</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="px-4 py-3">{new Date(o.createdAt).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-3">{o.username || "-"}</td>
                  <td className="px-4 py-3 max-w-[280px] truncate" title={o.address}>{o.address || "-"}</td>
                  <td className="px-4 py-3">
                    <ul className="list-disc pl-5">
                      {(o.items || []).map((it, i) => (
                        <li key={i}>{it.name} × {it.qty}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{formatIDR(o.total)}</td>
                  <td className="px-4 py-3">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
