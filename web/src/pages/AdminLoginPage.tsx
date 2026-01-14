import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { setUser, isAuthenticated, user, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  if (!isLoading && isAuthenticated) {
    const dashboardPath = user?.role === 'ADMIN' ? '/admin' : '/shop';
    return <Navigate to={dashboardPath} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsSubmitting(true);

    const result = await authApi.adminLogin(data.email, data.password);

    if (result.error) {
      setError(result.message || result.error);
      setIsSubmitting(false);
      return;
    }

    if (result.data?.user) {
      setUser({
        id: result.data.user.id,
        role: result.data.user.role as 'ADMIN' | 'BUYER',
        name: result.data.user.name,
        email: result.data.user.email,
      });
      navigate('/admin');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-mandi-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-mandi-dark">Virtual Mandi</h1>
            <p className="text-mandi-muted mt-2">Admin Login</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@virtualmandi.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-mandi-muted hover:text-mandi-green">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
