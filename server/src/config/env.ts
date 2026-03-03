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
    email: {
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.EMAIL_FROM || 'noreply@hireflow.io',
    },
    storage: {
        bucketName: process.env.STORAGE_BUCKET || 'hireflow-recordings',
        region: process.env.STORAGE_REGION || 'ap-south-1',
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID || '',
        keySecret: process.env.RAZORPAY_KEY_SECRET || '',
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    },
} as const;
