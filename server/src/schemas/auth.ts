import { z } from 'zod';

// Admin login schema
export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Firebase token verification schema
export const firebaseVerifySchema = z.object({
  idToken: z.string().min(1, 'ID Token is required'),
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
export type UserResponse = z.infer<typeof userResponseSchema>;
