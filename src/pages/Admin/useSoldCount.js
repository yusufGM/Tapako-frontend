import { useEffect, useState } from "react";
import useUserStore from "../../components/store/useUserStore";
import api from "../../lib/api";

async function fetchAdminOrdersWithFallback(token) {
  const primary = `${api.baseURL}/admin/orders`;
  const legacy = `${api.baseURL.replace(/\/api$/, "")}/orders`;
  const headers = { Authorization: `Bearer ${token}` };
  let r = await fetch(primary, { headers });
  if (r.status === 404) r = await fetch(legacy, { headers });
  if (!r.ok) {
    const data = await r.json().catch(() => ({}));
    throw new Error(data?.error || "Gagal memuat orders");
  }
  return r.json();
}

export default function useSoldCount() {
  const { token } = useUserStore();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let on = true;
    if (!token) return;
    fetchAdminOrdersWithFallback(token)
      .then((orders) => {
        if (!on) return;
        const total = Array.isArray(orders)
          ? orders.reduce((sum, o) => sum + (o.items || []).reduce((s, it) => s + (it.qty || 0), 0), 0)
          : 0;
        setCount(total);
      })
      .catch(() => {});
    return () => { on = false; };
  }, [token]);

  return count;
}
