import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/lib/api';

const otpSchema = z.object({
  otp: z.string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must be numeric'),
});

type OtpFormData = z.infer<typeof otpSchema>;

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, isAuthenticated, user, isLoading: authLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const phone = location.state?.phone as string;

  // Redirect if already authenticated
  if (!authLoading && isAuthenticated) {
    const dashboardPath = user?.role === 'ADMIN' ? '/admin' : '/shop';
    return <Navigate to={dashboardPath} replace />;
  }

  // Redirect if no phone in state
  useEffect(() => {
    if (!phone) {
      navigate('/buyer-login');
    }
  }, [phone, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OtpFormData) => {
    setError(null);
    setIsLoading(true);

    const result = await authApi.verifyOtp(phone, data.otp);

    if (result.error) {
      setError(result.message || result.error);
      setIsLoading(false);
      return;
    }

    if (result.data?.user) {
      setUser({
        id: result.data.user.id,
        role: result.data.user.role as 'ADMIN' | 'BUYER',
        name: result.data.user.name,
        phone: result.data.user.phone,
      });
      navigate('/shop');
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setError(null);
    setIsResending(true);

    const result = await authApi.requestOtp(phone);

    if (result.error) {
      setError(result.message || result.error);
    } else {
      setResendCooldown(30); // 30 second cooldown
      if (result.data?.devOtp) {
        console.log('Dev OTP:', result.data.devOtp);
      }
    }

    setIsResending(false);
  };

  if (!phone) {
    return null;
  }

  return (
    <div className="min-h-screen bg-mandi-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-mandi-dark">Verify OTP</h1>
            <p className="text-mandi-muted mt-2">
              Enter the 6-digit code sent to +91 {phone}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                error={errors.otp?.message}
                {...register('otp')}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <div>
              {resendCooldown > 0 ? (
                <p className="text-sm text-mandi-muted">
                  Resend OTP in {resendCooldown}s
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-sm text-mandi-green hover:underline disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </button>
              )}
            </div>
            <Link
              to="/buyer-login"
              className="text-sm text-mandi-muted hover:text-mandi-green block"
            >
              &larr; Change phone number
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
