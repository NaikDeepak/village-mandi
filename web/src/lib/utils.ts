import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes a phone number by removing all non-digits and extracting the last 10 digits.
 * This is primarily used for input masking/formatting as the user types.
 * @returns A string of 0-10 digits.
 */
export function normalizePhone(phone: string): string {
  let normalized = phone;
  if (normalized.includes('+91')) {
    normalized = normalized.replace('+91', '');
  }
  return normalized.replace(/\D/g, '').slice(-10);
}

/**
 * Validates if a Normalized phone number is a valid 10-digit mobile number.
 * @param phone The normalized phone number (digits only)
 */
export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}
