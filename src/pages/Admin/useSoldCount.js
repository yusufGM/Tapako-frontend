import { useEffect, useState } from "react";
import useUserStore from "../../components/store/useUserStore";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function useSoldCount() {
  const { token } = useUserStore();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let on = true;
    if (!token) return;

    fetch(`${API_BASE}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => (r.ok ? r.json() : []))
      .then((orders) => {
        if (!on) return;
        const total = Array.isArray(orders)
          ? orders.reduce(
              (sum, o) => sum + (o.items || []).reduce((s, it) => s + (it.qty || 0), 0),
              0
            )
          : 0;
        setCount(total);
      })
      .catch(() => {});

    return () => {
      on = false;
    };
  }, [token]);

  return count;
}
