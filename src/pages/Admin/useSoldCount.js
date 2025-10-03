import { useEffect, useState } from "react";

export function useSoldCount() {
  const [sold, setSold] = useState(0);
  const [loading, setLoading] = useState(true);

  async function fetchSold() {
    try {
      const res = await fetch("/api/stats/sold-count");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSold(data?.sold ?? 0);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSold();
    const t = setInterval(fetchSold, 10000);
    return () => clearInterval(t);
  }, []);

  return { sold, loading };
}
