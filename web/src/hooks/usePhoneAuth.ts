import {
  type ConfirmationResult,
  type RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';

const COOLDOWN_SECONDS = 60;

export function usePhoneAuth() {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const requestOtp = useCallback(
    async (phone: string, recaptchaVerifier: RecaptchaVerifier) => {
      if (cooldown > 0) return;

      setIsLoading(true);
      setError(null);
      try {
        const result = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
        setConfirmationResult(result);
        setCooldown(COOLDOWN_SECONDS);
      } catch (err: any) {
        console.error('Phone auth error:', err);
        setError(err.message || 'Failed to send OTP');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [cooldown]
  );

  const verifyOtp = useCallback(
    async (code: string) => {
      if (!confirmationResult) {
        throw new Error('No OTP request in progress');
      }

      setIsLoading(true);
      setError(null);
      try {
        const result = await confirmationResult.confirm(code);
        return result.user;
      } catch (err: any) {
        console.error('OTP verification error:', err);
        setError(err?.message || 'Invalid OTP');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [confirmationResult]
  );

  const reset = useCallback(() => {
    setConfirmationResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    requestOtp,
    verifyOtp,
    confirmationResult,
    error,
    isLoading,
    cooldown,
    reset,
  };
}
