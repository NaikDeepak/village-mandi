/**
 * Normalizes a phone number by removing all non-digits and extracting the last 10 digits.
 * This handles formats like +91, 0, or just the 10-digit number.
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '').slice(-10);
}
