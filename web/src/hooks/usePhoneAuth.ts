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
      console.log('requestOtp called with:', { phone });
      if (cooldown > 0) {
        console.log('requestOtp: Cooldown active', cooldown);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        console.log('requestOtp: invoking signInWithPhoneNumber...');
        const result = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
        console.log('requestOtp: signInWithPhoneNumber success', result);
        setConfirmationResult(result);
        setCooldown(COOLDOWN_SECONDS);
      } catch (err: any) {
        console.error('requestOtp: Phone auth error:', err);
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
      console.log('verifyOtp called with code length:', code.length);
      if (!confirmationResult) {
        console.error('verifyOtp: No confirmationResult found');
        throw new Error('No OTP request in progress');
      }

      setIsLoading(true);
      setError(null);
      try {
        console.log('verifyOtp: confirming code...');
        const result = await confirmationResult.confirm(code);
        console.log('verifyOtp: confirm success, user:', result.user);
        return result.user;
      } catch (err: any) {
        console.error('verifyOtp: OTP verification error:', err);
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
