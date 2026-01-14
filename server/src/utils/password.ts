import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function generateOTP(): string {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOTPExpiry(): Date {
    // OTP expires in 10 minutes
    return new Date(Date.now() + 10 * 60 * 1000);
}
