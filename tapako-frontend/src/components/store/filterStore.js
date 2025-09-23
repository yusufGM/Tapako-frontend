
import { create } from "zustand";

export const useFilterStore = create((set) => ({
  filters: { sale: false, gender: 'all', ageGroup: 'all', price: 'none' },
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  toggleFilter: (key) => set((state) => ({ filters: { ...state.filters, [key]: !state.filters[key] } })),
}));
