import { z } from 'zod';

export const registerSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email address')
        .toLowerCase(),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[!@#$%^&*]/, 'Password must contain at least one special character'),
    role: z.enum(['HR', 'INTERVIEWER']).default('HR'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
