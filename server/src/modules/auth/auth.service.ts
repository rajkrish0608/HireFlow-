import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../config/db';
import { config } from '../../config/env';
import { users } from '../../db/schema';
import type { RegisterInput, LoginInput } from './auth.schema';

export type UserRole = 'HR' | 'INTERVIEWER' | 'ADMIN';

export interface JwtPayload {
    userId: string;
    role: UserRole;
    email: string;
}

function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    });
}

export async function registerUser(input: RegisterInput) {
    const { email, password, role } = input;

    // Check if user already exists
    const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (existing.length > 0) {
        throw Object.assign(new Error('An account with this email already exists'), {
            statusCode: 409,
        });
    }

    const passwordHash = await bcrypt.hash(password, config.bcryptRounds);

    const [user] = await db
        .insert(users)
        .values({ email, passwordHash, role })
        .returning({
            id: users.id,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
        });

    const token = generateToken({ userId: user.id, role: user.role, email: user.email });

    return { token, user };
}

export async function loginUser(input: LoginInput) {
    const { email, password } = input;

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (!user) {
        throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
    }

    if (!user.isActive) {
        throw Object.assign(new Error('Account is deactivated. Contact support.'), {
            statusCode: 403,
        });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
    }

    const token = generateToken({ userId: user.id, role: user.role, email: user.email });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    };
}
