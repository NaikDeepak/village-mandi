import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const phoneSchema = z.object({
  phone: z
    .string()
    .length(10, 'Phone number must be 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

export function BuyerLoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  // Redirect if already authenticated
  if (!isLoading && isAuthenticated) {
    const dashboardPath = user?.role === 'ADMIN' ? '/admin' : '/shop';
    return <Navigate to={dashboardPath} replace />;
  }

  const onSubmit = async (data: PhoneFormData) => {
    setError(null);
    setIsSubmitting(true);

    const result = await authApi.requestOtp(data.phone);

    if (result.error) {
      setError(result.message || result.error);
      setIsSubmitting(false);
      return;
    }

    // In dev mode, show OTP in console (also logged on server)
    if (result.data?.devOtp) {
    }

    // Navigate to OTP verification page
    navigate('/verify-otp', { state: { phone: data.phone } });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-mandi-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-mandi-dark">Virtual Mandi</h1>
            <p className="text-mandi-muted mt-2">Buyer Login</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-mandi-muted bg-mandi-cream text-mandi-muted text-sm">
                  +91
                </span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  className="rounded-l-none"
                  maxLength={10}
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending OTP...' : 'Get OTP'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-mandi-muted">
              Only invited buyers can login. Contact admin for access.
            </p>
            <Link to="/" className="text-sm text-mandi-muted hover:text-mandi-green block">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
