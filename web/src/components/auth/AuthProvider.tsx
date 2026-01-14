import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/lib/api';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const result = await authApi.me();

      if (result.data?.user) {
        setUser({
          id: result.data.user.id,
          role: result.data.user.role as 'ADMIN' | 'BUYER',
          name: result.data.user.name,
          email: result.data.user.email,
          phone: result.data.user.phone,
        });
      } else {
        setUser(null);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
