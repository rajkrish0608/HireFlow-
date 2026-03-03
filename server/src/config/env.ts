import dotenv from 'dotenv';
dotenv.config();

const requiredVars = [
    'DATABASE_URL',
    'REDIS_URL',
    'JWT_SECRET',
] as const;

for (const varName of requiredVars) {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
}

export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
    databaseUrl: process.env.DATABASE_URL!,
    redisUrl: process.env.REDIS_URL!,
    jwt: {
        secret: process.env.JWT_SECRET!,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
} as const;
