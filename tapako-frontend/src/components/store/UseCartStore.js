import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useLocation } from 'react-router-dom';

let locationGetter; 


export const usePathListener = () => {
  const location = useLocation();
  locationGetter = location.pathname;
};

const useCartStore = create(
  persist(
    (set, get) => ({
      isOpen: false,
      cart: [],

      openDrawer: () => set((state) => (locationGetter === '/login' ? state : { isOpen: true })),
      closeDrawer: () => set({ isOpen: false }),

      addToCart: (product) => set((state) => {
        const existing = state.cart.find((p) => p._id === product._id);
        const updated = existing
          ? state.cart.map((p) => (p._id === product._id ? { ...p, qty: (p.qty || 0) + 1 } : p))
          : [...state.cart, { ...product, qty: 1 }];
        return { cart: updated };
      }),

      updateQty: (index, qty) => set((state) => {
        const arr = [...state.cart];
        if (qty <= 0) arr.splice(index, 1); else arr[index].qty = qty;
        return { cart: arr };
      }),

      removeItem: (index) => set((state) => { const arr = [...state.cart]; arr.splice(index, 1); return { cart: arr }; }),
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i._id !== id) })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'cart-storage' }
  )
);

export default useCartStore;
