import {
  type ConfirmationResult,
  type RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { auth } from '../lib/firebase';

const COOLDOWN_SECONDS = 60;

export function usePhoneAuth() {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cooldown > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cooldown]);

  const requestOtp = useCallback(
    async (phone: string, recaptchaVerifier: RecaptchaVerifier) => {
      if (cooldown > 0) {
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const result = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
        setConfirmationResult(result);
        setCooldown(COOLDOWN_SECONDS);
      } catch (err: unknown) {
        console.error('requestOtp: Phone auth error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
        setError(errorMessage);
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
        console.error('verifyOtp: No confirmationResult found');
        throw new Error('No OTP request in progress');
      }

      setIsLoading(true);
      setError(null);
      try {
        const result = await confirmationResult.confirm(code);
        return result.user;
      } catch (err: unknown) {
        console.error('verifyOtp: OTP verification error:', err);

        // Handle Firebase Blocking Function errors
        const errorMessage = err instanceof Error ? err.message : 'Invalid OTP';

        if (errorMessage.includes('ACCOUNT_PENDING')) {
          const error = new Error('ACCOUNT_PENDING');
          setError('Account pending approval');
          throw error;
        }

        if (errorMessage.includes('ACCOUNT_REJECTED')) {
          // Extract the JSON part if it exists
          try {
            const jsonMatch = errorMessage.match(/\{.*\}/);
            if (jsonMatch) {
              const data = JSON.parse(jsonMatch[0]);
              const error = new Error('ACCOUNT_REJECTED');
              Object.assign(error, { reason: data.reason });
              setError(data.reason || 'Account rejected');
              throw error;
            }
          } catch (e) {
            console.error('Failed to parse rejection reason', e);
          }
          const error = new Error('ACCOUNT_REJECTED');
          throw error;
        }

        setError(errorMessage);
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
