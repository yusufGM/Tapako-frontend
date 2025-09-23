import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      token: null,
      username: null,
      userId: null,
      role: null,
      email: null,
      setUser: ({ token, username, userId, role, email }) => set({ token, username, userId, role, email }),
      clearUser: () => set({ token: null, username: null, userId: null, role: null, email: null }),
    }),
    { name: 'user-auth' }
  )
);

export default useUserStore;
