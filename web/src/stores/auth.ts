import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'BUYER';
export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

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
  registrationStatus: RegistrationStatus | null;
  rejectionReason: string | null;
  setUser: (user: User | null) => void;
  setRegistrationStatus: (status: RegistrationStatus | null, reason?: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      registrationStatus: null,
      rejectionReason: null,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          registrationStatus: user ? 'APPROVED' : null,
        }),
      setRegistrationStatus: (status, reason = null) =>
        set({
          registrationStatus: status,
          rejectionReason: reason,
          isAuthenticated: false,
          user: null,
        }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: async () => {
        try {
          // 1. Sign out from Firebase
          await signOut(auth);
        } catch (err) {
          console.warn('Firebase signout failed:', err);
        }
        // 2. Clear local state (persist will update storage accordingly)
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          registrationStatus: null,
          rejectionReason: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
