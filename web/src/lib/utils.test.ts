import { describe, expect, it } from 'vitest';
import { isValidPhone, normalizePhone } from './utils';

describe('Phone Utilities', () => {
  describe('normalizePhone', () => {
    it('should strip non-digits', () => {
      expect(normalizePhone('123-456-7890')).toBe('1234567890');
      expect(normalizePhone('(123) 456 7890')).toBe('1234567890');
      expect(normalizePhone('abc123def456')).toBe('123456');
    });

    it('should take the last 10 digits', () => {
      expect(normalizePhone('+919876543210')).toBe('9876543210');
      expect(normalizePhone('09876543210')).toBe('9876543210');
      expect(normalizePhone('919876543210')).toBe('9876543210');
    });

    it('should handle partial inputs', () => {
      expect(normalizePhone('987')).toBe('987');
      expect(normalizePhone('+91 987')).toBe('987');
    });

    it('should handle empty strings', () => {
      expect(normalizePhone('')).toBe('');
    });
  });

  describe('isValidPhone', () => {
    it('should return true for valid 10-digit mobile numbers', () => {
      expect(isValidPhone('9876543210')).toBe(true);
      expect(isValidPhone('6876543210')).toBe(true);
      expect(isValidPhone('7000000000')).toBe(true);
      expect(isValidPhone('8000000000')).toBe(true);
    });

    it('should return false for numbers starting with 0-5', () => {
      expect(isValidPhone('0876543210')).toBe(false);
      expect(isValidPhone('1876543210')).toBe(false);
      expect(isValidPhone('5876543210')).toBe(false);
    });

    it('should return false for length != 10', () => {
      expect(isValidPhone('987654321')).toBe(false); // 9 digits
      expect(isValidPhone('98765432100')).toBe(false); // 11 digits
    });

    it('should return false for non-numeric characters', () => {
      expect(isValidPhone('98765a3210')).toBe(false);
      expect(isValidPhone('98765-3210')).toBe(false);
    });

    it('should return false for empty strings', () => {
      expect(isValidPhone('')).toBe(false);
    });
  });
});
