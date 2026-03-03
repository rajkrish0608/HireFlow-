import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/env';
import { pool } from './config/db';
import { redis } from './config/redis';

// ─── Routers ──────────────────────────────────────────────────────────────────
import authRouter from './modules/auth/auth.router';
import jobsRouter from './modules/jobs/jobs.router';
import candidatesRouter from './modules/candidates/candidates.router';
import interviewsRouter from './modules/interviews/interviews.router';
import matchingRouter from './modules/matching/matching.router';
import scorecardsRouter from './modules/scorecards/scorecards.router';
import codingRouter from './modules/coding/coding.router';
import recordingsRouter from './modules/recordings/recordings.router';
import earningsRouter from './modules/earnings/earnings.router';

// ─── Middleware ───────────────────────────────────────────────────────────────
import { authenticate } from './middleware/authenticate';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'hireflow-api',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
    });
});

// ─── Public Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);

// ─── Protected: Profile ───────────────────────────────────────────────────────
app.get('/api/me', authenticate, (req, res) => {
    res.json({ status: 'success', data: req.user });
});

// ─── HR Dashboard APIs ────────────────────────────────────────────────────────
app.use('/api/jobs', jobsRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/interviews', interviewsRouter);

// ─── Interviewer Matching Engine ──────────────────────────────────────────────
app.use('/api/interviewer', matchingRouter);

// ─── Scorecard & Reports ──────────────────────────────────────────────────────
app.use('/api/scorecard', scorecardsRouter);
app.use('/api/report', scorecardsRouter);

// ─── Coding Challenge Engine ──────────────────────────────────────────────────
app.use('/api/coding', codingRouter);

// ─── Video & Recordings ───────────────────────────────────────────────────────
app.use('/api/recordings', recordingsRouter);

// ─── Earnings Dashboard ───────────────────────────────────────────────────────
app.use('/api/earnings', earningsRouter);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function bootstrap() {
    try {
        const client = await pool.connect();
        console.log('[DB] ✅ PostgreSQL connected');
        client.release();

        await redis.connect();

        app.listen(config.port, () => {
            console.log(`\n🚀 HireFlow API v2.0 → http://localhost:${config.port}`);
            console.log(`   Environment : ${config.nodeEnv}`);
            console.log(`   Health      : http://localhost:${config.port}/health`);
            console.log('\n📋 API Routes:');
            console.log('   POST  /api/jobs/create');
            console.log('   POST  /api/interviews/schedule');
            console.log('   GET   /api/interviewer/match?jobRoleId=');
            console.log('   POST  /api/scorecard/submit');
            console.log('   GET   /api/report/:sessionId');
            console.log('   POST  /api/coding/challenge/start');
            console.log('   GET   /api/earnings\n');
        });
    } catch (error) {
        console.error('[Bootstrap] ❌ Failed to start server:', error);
        process.exit(1);
    }
}

bootstrap();

export default app;
