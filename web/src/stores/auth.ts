import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'BUYER';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string | null;
  email: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: async () => {
        try {
          // 1. Sign out from Firebase
          await signOut(auth);
        } catch (err) {
          console.warn('Firebase signout failed:', err);
        }
        // 2. Clear local state
        set({ user: null, isAuthenticated: false, isLoading: false });
        // 3. Clear storage explicitly to be safe
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
