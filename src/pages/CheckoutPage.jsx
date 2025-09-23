import { useState, useMemo } from 'react';
import useCartStore from '../components/store/useCartStore';
import useUserStore from '../components/store/useUserStore';
import { apiPost } from '../lib/api';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const { cart, clearCart } = useCartStore();
  const { token } = useUserStore();
  const [address, setAddress] = useState('');
  const [email, setEmail]     = useState('');
  const [phone, setPhone]     = useState('');

  const total = useMemo(() => cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0), [cart]);

  const handlePayment = async () => {
    if (!address || !email || !phone) {
      toast.error("Alamat, email, dan nomor WhatsApp tidak boleh kosong");
      return;
    }
    if (!token) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    try {
      const data = await apiPost("/checkout",
        { items: cart, address, email, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        toast.success("Checkout berhasil");
        clearCart();
      }
    } catch (err) {
      toast.error(err?.payload?.error || "Checkout gagal");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <input className="input input-bordered w-full" placeholder="Alamat lengkap" value={address} onChange={(e)=>setAddress(e.target.value)} />
          <input className="input input-bordered w-full" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="input input-bordered w-full" placeholder="No. WhatsApp" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          <button className="btn w-full bg-black text-white" onClick={handlePayment}>Bayar sekarang</button>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-medium mb-2">Ringkasan</h2>
          <ul className="space-y-2 max-h-64 overflow-auto">
            {cart.map((it) => (
              <li key={it._id} className="flex items-center justify-between text-sm">
                <span className="truncate">{it.name} × {it.qty || 1}</span>
                <span>Rp{(it.price * (it.qty || 1)).toLocaleString("id-ID")}</span>
              </li>
            ))}
          </ul>
          <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp{total.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
