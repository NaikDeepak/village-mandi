import { z } from 'zod';

// Admin login schema
export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Buyer request OTP schema
export const requestOTPSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number (10 digits starting with 6-9)'),
});

// Buyer verify OTP schema
export const verifyOTPSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must be numeric'),
});

// User response (safe, no sensitive fields)
export const userResponseSchema = z.object({
  id: z.string(),
  role: z.enum(['ADMIN', 'BUYER']),
  name: z.string(),
  phone: z.string(),
  email: z.string().nullable(),
  isActive: z.boolean(),
  isInvited: z.boolean(),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type RequestOTPInput = z.infer<typeof requestOTPSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
