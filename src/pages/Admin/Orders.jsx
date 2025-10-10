import { useEffect, useMemo, useState } from "react";
import useUserStore from "../../components/store/useUserStore";
import api from "../../lib/api";

const formatIDR = (n = 0) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(Math.max(0, Number(n) || 0))
    .replace(/\s/g, "");

function useDebounced(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

async function fetchOrdersWithFallback({ token, params }) {
  const q = params.toString() ? `?${params.toString()}` : "";
  const primary = `${api.baseURL}/admin/orders${q}`;
  const legacy = `${api.baseURL.replace(/\/api$/, "")}/orders${q}`;
  const headers = { Authorization: `Bearer ${token}` };
  let r = await fetch(primary, { headers });
  if (r.status === 404) r = await fetch(legacy, { headers });
  const data = await r.json().catch(() => []);
  if (!r.ok) throw new Error(data?.error || "Gagal memuat orders");
  return Array.isArray(data) ? data : [];
}

export default function AdminOrders() {
  const { token } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 400);
  const tz = new Date().getTimezoneOffset();

  const [page, setPage] = useState(1);
  const limit = 15;

  const fetchOrders = async () => {
    setLoading(true);
    setErr(null);
    try {
      const p = new URLSearchParams();
      if (from) p.set("from", from);
      if (to) p.set("to", to);
      if (debouncedSearch) p.set("username", debouncedSearch);
      p.set("tz", String(tz));
      const data = await fetchOrdersWithFallback({ token, params: p });
      setOrders(data);
      setPage(1);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [from, to, debouncedSearch, token]);

  const summary = useMemo(() => {
    const total = orders.reduce((s, o) => s + (o.total || 0), 0);
    return { count: orders.length, total };
  }, [orders]);

  const pages = Math.max(1, Math.ceil((orders.length || 0) / limit));
  const start = (page - 1) * limit;
  const visible = orders.slice(start, start + limit);

  const clearFilters = () => { setFrom(""); setTo(""); setSearch(""); };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Orders</h2>

      <div className="bg-white rounded-xl border p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600 mb-1">Dari Tanggal</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600 mb-1">Sampai Tanggal</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="text-xs font-medium text-gray-600 mb-1">Cari Username</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="mis. tapako" className="border rounded px-2 py-1" />
        </div>
        <div className="md:col-span-4 flex gap-2 justify-end">
          <div className="px-3 py-1 rounded border bg-white text-sm self-center mr-auto">
            {summary.count} order • Total {formatIDR(summary.total)}
          </div>
          <button onClick={clearFilters} className="px-3 py-2 rounded border bg-white hover:bg-gray-50">Reset</button>
          <button onClick={fetchOrders} className="px-3 py-2 rounded bg-black text-white">Terapkan</button>
        </div>
      </div>

      {loading ? (
        <div className="border rounded-xl p-6 animate-pulse">Memuat…</div>
      ) : err ? (
        <div className="border rounded-xl p-6 text-red-600">{err}</div>
      ) : visible.length === 0 ? (
        <div className="border rounded-xl p-6 text-gray-600">Tidak ada order untuk filter saat ini.</div>
      ) : (
        <>
          <div className="border rounded-xl overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Waktu</th>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Alamat</th>
                  <th className="px-4 py-3 text-left">Items</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((o) => (
                  <tr key={o._id} className="border-t">
                    <td className="px-4 py-3">{new Date(o.createdAt).toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3">{o.username || "-"}</td>
                    <td className="px-4 py-3 max-w-[280px] truncate" title={o.address}>{o.address || "-"}</td>
                    <td className="px-4 py-3">
                      <ul className="list-disc pl-5">
                        {(o.items || []).map((it, i) => (<li key={i}>{it.name} × {it.qty}</li>))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatIDR(o.total)}</td>
                    <td className="px-4 py-3">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-xl bg-gray-50">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-2 rounded border bg-white disabled:opacity-50">‹ Prev</button>
            <div className="text-sm">Hal {page} dari {pages} • {orders.length} orders</div>
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages} className="px-3 py-2 rounded border bg-white disabled:opacity-50">Next ›</button>
          </div>
        </>
      )}
    </div>
  );
}
