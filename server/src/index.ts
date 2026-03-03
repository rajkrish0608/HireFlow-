import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/env';
import { pool } from './config/db';
import { redis } from './config/redis';
import authRouter from './modules/auth/auth.router';
import { authenticate } from './middleware/authenticate';
import { authorize } from './middleware/authorize';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// ─── Security & Parsing ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Trust proxy (for correct IP behind Nginx) ───────────────────────────────
app.set('trust proxy', 1);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'hireflow-api',
        timestamp: new Date().toISOString(),
    });
});

// ─── Public Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);

// ─── Protected Route Examples ─────────────────────────────────────────────────
app.get('/api/me', authenticate, (req, res) => {
    res.json({ status: 'success', data: req.user });
});

app.get('/api/admin/dashboard', authenticate, authorize('ADMIN'), (_req, res) => {
    res.json({ status: 'success', message: 'Welcome, Admin.' });
});

app.get('/api/hr/dashboard', authenticate, authorize('HR', 'ADMIN'), (_req, res) => {
    res.json({ status: 'success', message: 'Welcome to HR Dashboard.' });
});

app.get('/api/interviewer/dashboard', authenticate, authorize('INTERVIEWER', 'ADMIN'), (_req, res) => {
    res.json({ status: 'success', message: 'Welcome to Interviewer Dashboard.' });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function bootstrap() {
    try {
        // Verify DB connection
        const client = await pool.connect();
        console.log('[DB] ✅ PostgreSQL connected');
        client.release();

        // Connect Redis
        await redis.connect();

        app.listen(config.port, () => {
            console.log(`\n🚀 HireFlow API running → http://localhost:${config.port}`);
            console.log(`   Environment: ${config.nodeEnv}`);
            console.log(`   Health:      http://localhost:${config.port}/health\n`);
        });
    } catch (error) {
        console.error('[Bootstrap] ❌ Failed to start server:', error);
        process.exit(1);
    }
}

bootstrap();

export default app;
