import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { type ReactNode, useEffect } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Optimistically skip loading if already hydrated
        if (!useAuthStore.getState().isAuthenticated) {
          setLoading(true);
        }

        const result = await authApi.me();

        if (result.data?.user) {
          setUser({
            id: result.data.user.id,
            role: result.data.user.role,
            name: result.data.user.name,
            email: result.data.user.email,
            phone: result.data.user.phone,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
