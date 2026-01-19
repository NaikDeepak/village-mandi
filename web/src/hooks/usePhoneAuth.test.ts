import { act, renderHook } from '@testing-library/react';
import {
  type ConfirmationResult,
  type RecaptchaVerifier,
  type User,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePhoneAuth } from './usePhoneAuth';

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  signInWithPhoneNumber: vi.fn(),
  getAuth: vi.fn(),
}));

// Mock ../lib/firebase
vi.mock('../lib/firebase', () => ({
  auth: {},
}));

describe('usePhoneAuth', () => {
  const mockPhone = '9876543210';
  const mockRecaptchaVerifier = {} as RecaptchaVerifier;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePhoneAuth());

    expect(result.current.confirmationResult).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.cooldown).toBe(0);
  });

  it('should request OTP successfully', async () => {
    const mockConfirmationResult = {
      confirm: vi.fn(),
    } as unknown as ConfirmationResult;
    vi.mocked(signInWithPhoneNumber).mockResolvedValue(mockConfirmationResult);

    const { result } = renderHook(() => usePhoneAuth());

    await act(async () => {
      await result.current.requestOtp(mockPhone, mockRecaptchaVerifier);
    });

    expect(signInWithPhoneNumber).toHaveBeenCalled();
    expect(result.current.confirmationResult).toBe(mockConfirmationResult);
    expect(result.current.cooldown).toBe(60);
    expect(result.current.error).toBeNull();
  });

  it('should handle request OTP error', async () => {
    const mockError = new Error('Too many requests');
    vi.mocked(signInWithPhoneNumber).mockRejectedValue(mockError);

    const { result } = renderHook(() => usePhoneAuth());

    await act(async () => {
      try {
        await result.current.requestOtp(mockPhone, mockRecaptchaVerifier);
      } catch (_e) {
        // ignore
      }
    });

    expect(result.current.error).toBe('Too many requests');
    expect(result.current.isLoading).toBe(false);
  });

  it('should respect cooldown and not allow multiple requests', async () => {
    vi.mocked(signInWithPhoneNumber).mockResolvedValue({} as ConfirmationResult);

    const { result } = renderHook(() => usePhoneAuth());

    await act(async () => {
      await result.current.requestOtp(mockPhone, mockRecaptchaVerifier);
    });

    expect(signInWithPhoneNumber).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.requestOtp(mockPhone, mockRecaptchaVerifier);
    });

    // Should still be 1 because of cooldown
    expect(signInWithPhoneNumber).toHaveBeenCalledTimes(1);
  });

  it('should verify OTP successfully', async () => {
    const mockUser = { uid: 'user-123' } as User;
    const mockConfirmationResult = {
      confirm: vi.fn().mockResolvedValue({ user: mockUser }),
    } as unknown as ConfirmationResult;
    vi.mocked(signInWithPhoneNumber).mockResolvedValue(mockConfirmationResult);

    const { result } = renderHook(() => usePhoneAuth());

    // First request OTP
    await act(async () => {
      await result.current.requestOtp(mockPhone, mockRecaptchaVerifier);
    });

    // Then verify
    let user: User | null = null;
    await act(async () => {
      user = await result.current.verifyOtp('123456');
    });

    expect(vi.mocked(mockConfirmationResult.confirm)).toHaveBeenCalledWith('123456');
    expect(user).toBe(mockUser);
    expect(result.current.error).toBeNull();
  });

  it('should handle verify OTP error', async () => {
    const mockConfirmationResult = {
      confirm: vi.fn().mockRejectedValue(new Error('Invalid code')),
    } as unknown as ConfirmationResult;
    vi.mocked(signInWithPhoneNumber).mockResolvedValue(mockConfirmationResult);

    const { result } = renderHook(() => usePhoneAuth());

    await act(async () => {
      await result.current.requestOtp(mockPhone, mockRecaptchaVerifier);
    });

    await act(async () => {
      try {
        await result.current.verifyOtp('wrong');
      } catch (_e) {
        // ignore
      }
    });

    expect(result.current.error).toBe('Invalid code');
  });

  it('should reset state correctly', async () => {
    vi.mocked(signInWithPhoneNumber).mockResolvedValue({} as ConfirmationResult);

    const { result } = renderHook(() => usePhoneAuth());

    await act(async () => {
      await result.current.requestOtp(mockPhone, mockRecaptchaVerifier);
    });

    expect(result.current.confirmationResult).not.toBeNull();

    act(() => {
      result.current.reset();
    });

    expect(result.current.confirmationResult).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should decrement cooldown over time', async () => {
    vi.mocked(signInWithPhoneNumber).mockResolvedValue({} as ConfirmationResult);

    const { result } = renderHook(() => usePhoneAuth());

    await act(async () => {
      await result.current.requestOtp(mockPhone, mockRecaptchaVerifier);
    });

    expect(result.current.cooldown).toBe(60);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.cooldown).toBe(59);

    act(() => {
      vi.advanceTimersByTime(59000);
    });
    expect(result.current.cooldown).toBe(0);
  });
});
