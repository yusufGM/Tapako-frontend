import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "./store/UseCartStore";
import useUserStore from "./store/UseUserStore";
import { toast } from "sonner"; 

function CartDrawer() {
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const { isOpen, cart, closeDrawer, updateQty, removeItem } = useCartStore();
  const { token } = useUserStore();

  const total = cart.reduce((sum, p) => sum + (p.price || 0) * (p.qty || 0), 0);

  useEffect(() => {
    const onClick = (e) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target)) closeDrawer();
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [isOpen, closeDrawer]);

  if (!isOpen) return null;

  const goCheckout = (e) => {
    e.preventDefault();
    if (!token) { toast.error('Silakan login terlebih dahulu.'); navigate('/login'); return; }
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <aside ref={drawerRef} className={`transition-transform duration-300 ease-in-out fixed top-0 right-0 h-full w-96 bg-gray-900 shadow-lg flex flex-col z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl text-white mb-1">Shopping Cart</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <p className="text-white text-center">Keranjang kosong.</p>
        ) : (
          cart.map((item, idx) => (
            <div key={idx} className="grid grid-cols-[50px_1fr_auto_auto_24px] gap-3 items-center p-2 bg-gray-800 rounded">
              <img src={item.imgSrc || '/fallback.png'} alt={item.name} className="w-12 h-12 object-cover rounded" onError={(e) => (e.currentTarget.src = '/fallback.png')} />
              <div className="text-white text-sm">{item.name}</div>
              <div className="text-white text-sm">Rp {Number(item.price || 0).toLocaleString('id-ID')}</div>
              <input type="number" min="0" value={item.qty} onChange={(e) => updateQty(idx, parseInt(e.target.value || '0', 10))} className="w-14 rounded text-center bg-white h-9" />
              <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-300" aria-label="Remove item">✕</button>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-800 p-4 text-white">
        <div className="flex justify-between mb-3 font-semibold">
          <span>Total</span>
          <span>Rp {total.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={goCheckout} className="px-4 py-2 rounded 
          inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full uppercase font-semibold tracking-widest shadow-2xl hover:scale-105 transition-transform
          ">Checkout</button>
        </div>
      </div>
    </aside>
  );
}

export default CartDrawer;
