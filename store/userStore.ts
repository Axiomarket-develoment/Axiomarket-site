// store/userStore.ts
import { create } from "zustand";

interface UserStore {
  isLoggedIn: boolean;
  balance: string;
  user: any;
  hasHydrated: boolean;
  setUser: (user: any) => void;
  setHydrated: (state: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  balance: "0.0",
  user: null,
  hasHydrated: false,

  setUser: (user) =>
    set({
      isLoggedIn: !!user,
      balance: user?.balance?.testnet?.toString() || "0.0",
      user,
    }),

  setHydrated: (state) => set({ hasHydrated: state }),

  logout: () =>
    set({ isLoggedIn: false, balance: "0.0", user: null }),
}));