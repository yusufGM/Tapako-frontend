import { useState, useEffect, useMemo } from "react";
import useCartStore from "../components/store/useCartStore";
import useUserStore from "../components/store/useUserStore";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const formatIDR = (n = 0) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(Math.max(0, Number(n) || 0))
    .replace(/\s/g, "");

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const { token, username: storeUsername, email: storeEmail } = useUserStore();

  const [username, setUsername] = useState(storeUsername || "");
  const [email, setEmail] = useState(storeEmail || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (storeUsername && !username) setUsername(storeUsername);
    if (storeEmail && !email) setEmail(storeEmail);
  }, [storeUsername, storeEmail]);

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 0), 0),
    [cart]
  );

  const validate = () => {
    if (!username.trim()) return "Nama wajib diisi.";
    if (!address.trim()) return "Alamat pengiriman wajib diisi.";
    if (!cart.length) return "Cart kosong.";
    if (!token) return "Silakan login terlebih dahulu.";
    const hasBadItem = cart.some((i) => !i || !i.name || !i.price || !i.qty);
    if (hasBadItem) return "Terdapat item yang tidak valid pada cart.";
    return null;
  };

  const normalizeCart = () =>
    cart.map((i) => ({
      name: i.name,
      price: Number(i.price) || 0,
      qty: Math.max(1, Number(i.qty) || 1),
    }));

  const redirectToPayment = (data) => {
    const url =
      data?.paymentUrl ||
      data?.redirect_url ||
      data?.invoice?.invoice_url ||
      data?.data?.invoice_url ||
      data?.url ||
      null;
    if (url) {
      clearCart();
      window.location.assign(url);
      return true;
    }
    return false;
  };

  const handlePayment = async () => {
    const errMsg = validate();
    if (errMsg) {
      alert(errMsg);
      return;
    }
    if (submitting) return;
    setSubmitting(true);

    const payload = {
      items: normalizeCart(),
      address: address.trim(),
      email: email.trim(),
      whatsapp: phone.trim(),
      username: username.trim(),
      total,
    };

    try {
      const res = await fetch(`${API_BASE}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (res.status === 401) {
        alert("Sesi login berakhir. Silakan login lagi.");
        return;
      }
      if (!res.ok) {
        const message = data?.error || data?.message || `Checkout gagal (HTTP ${res.status}).`;
        alert(message);
        return;
      }
      if (!redirectToPayment(data)) {
        alert("URL pembayaran tidak ditemukan di respons server.");
      }
    } catch (e) {
      console.error("Checkout error:", e);
      alert("Terjadi kesalahan saat checkout. Periksa koneksi Anda dan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pt-24 pb-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Nama</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full h-10 px-3 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Nama lengkap"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 px-3 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="bob@contoh.com"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Nomor WhatsApp</label>
        <input
          type="tel"
          inputMode="numeric"
          pattern="0\\d{8,15}"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^\\d]/g, ""))}
          className="w-full h-10 px-3 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="08xxxxxxxxxx"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Format: 0 di depan, 9–16 digit (contoh: 08**********)</p>
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-semibold">Alamat Pengiriman</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-black"
          rows={4}
          required
        />
      </div>

      <div className="border-t pt-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Ringkasan Pesanan</h2>
        {cart.length === 0 ? (
          <p className="text-sm text-gray-500">Cart kosong.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {cart.map((item) => (
                <li key={item._id || item.id || `${item.name}-${item.qty}`} className="flex justify-between">
                  <span>{item.name} × {item.qty || 1}</span>
                  <span>{formatIDR((Number(item.price) || 0) * (Number(item.qty) || 0))}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 font-bold text-lg text-right">Total: {formatIDR(total)}</div>
          </>
        )}
      </div>

      <button
        onClick={handlePayment}
        disabled={submitting || !cart.length}
        className={`w-full h-10 text-white rounded transition ${
          submitting || !cart.length ? "bg-black/60 cursor-not-allowed" : "bg-black hover:bg-gray-900"
        }`}
      >
        {submitting ? "Memproses..." : "Bayar Sekarang"}
      </button>

      <p className="text-xs text-gray-400 mt-3">Endpoint: {API_BASE}/checkout</p>
    </div>
  );
}
