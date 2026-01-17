import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePhoneAuth } from '@/hooks/usePhoneAuth';
import { authApi } from '@/lib/api';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/stores/auth';
import { RecaptchaVerifier } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PhoneLoginFormProps {
  initialPhone?: string;
}

export function PhoneLoginForm({ initialPhone = '' }: PhoneLoginFormProps) {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const {
    requestOtp,
    verifyOtp,
    confirmationResult,
    error: authError,
    isLoading,
    cooldown,
    reset,
  } = usePhoneAuth();

  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Initialize reCAPTCHA on mount
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
    });

    recaptchaVerifierRef.current = verifier;
    verifier.render(); // Explicitly render the verifier

    // Cleanup on unmount
    return () => {
      verifier.clear();
    };
  }, []);

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLocalError(null);

    if (!phone || phone.length !== 10) {
      setLocalError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!recaptchaVerifierRef.current) {
      setLocalError('reCAPTCHA not initialized. Please refresh.');
      return;
    }

    try {
      const fullPhone = `+91${phone}`;
      await requestOtp(fullPhone, recaptchaVerifierRef.current);
    } catch (err) {
      console.error('handleSendOtp: Error caught', err);
      // If error is related to reCAPTCHA, we might need to reset
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
      const error = err as Error;
      setLocalError(error.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!otp || otp.length !== 6) {
      setLocalError('Please enter the 6-digit OTP');
      return;
    }

    try {
      const firebaseUser = await verifyOtp(otp);
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        const result = await authApi.verifyFirebaseToken(idToken);

        if (result.error) {
          console.error('handleVerifyOtp: Backend verification failed', result.error);
          setLocalError(result.message || result.error);
          return;
        }

        if (result.data?.user) {
          setUser({
            id: result.data.user.id,
            role: result.data.user.role as 'ADMIN' | 'BUYER',
            name: result.data.user.name,
            phone: result.data.user.phone,
          });
          navigate('/buyer-dashboard');
        }
      }
    } catch (err) {
      console.error('handleVerifyOtp: Error caught', err);
      const error = err as Error;
      setLocalError(error.message || 'Invalid OTP');
    }
  };

  const displayError = localError || authError;

  return (
    <div className="space-y-6">
      {displayError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {displayError}
        </div>
      )}

      <div id="recaptcha-container" />

      {!confirmationResult ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
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
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || cooldown > 0}>
            {isLoading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send OTP'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="otp">OTP Code</Label>
              <button
                type="button"
                onClick={reset}
                className="text-xs text-mandi-green hover:underline"
              >
                Change Number
              </button>
            </div>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
            <p className="text-xs text-center text-mandi-muted">Sent to +91 {phone}</p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify & Login'}
          </Button>

          {cooldown > 0 ? (
            <p className="text-xs text-center text-mandi-muted">Resend available in {cooldown}s</p>
          ) : (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full text-sm text-mandi-green hover:underline"
            >
              Resend OTP
            </button>
          )}
        </form>
      )}
    </div>
  );
}
