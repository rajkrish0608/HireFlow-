import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { recordCheatEvent, getCheatReport } from '../../middleware/antiCheat';
import { db } from '../../config/db';
import { redis } from '../../config/redis';
import {
    users,
    companies,
    interviewers,
    candidates,
    interviewSessions,
    scorecards,
    paymentRecords,
    auditLogs,
} from '../../db/schema';
import { eq, sql, count, sum, and, gte } from 'drizzle-orm';

const router = Router();
router.use(authenticate);
router.use(authorize('ADMIN'));

// ─── System Health Overview ───────────────────────────────────────────────────
router.get('/health', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        // DB check
        const dbStart = Date.now();
        await db.select({ val: sql`1` }).from(users).limit(1);
        const dbLatencyMs = Date.now() - dbStart;

        // Redis check
        const redisStart = Date.now();
        await redis.ping();
        const redisLatencyMs = Date.now() - redisStart;

        // Memory usage
        const mem = process.memoryUsage();

        return res.json({
            status: 'success',
            data: {
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                database: { status: 'healthy', latencyMs: dbLatencyMs },
                redis: { status: 'healthy', latencyMs: redisLatencyMs },
                memory: {
                    rss: `${(mem.rss / 1024 / 1024).toFixed(1)} MB`,
                    heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB`,
                    heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(1)} MB`,
                },
                nodeVersion: process.version,
                environment: process.env.NODE_ENV || 'development',
            },
        });
    } catch (err) { next(err); }
});

// ─── Platform Stats ───────────────────────────────────────────────────────────
router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const [usersCount] = await db.select({ count: count() }).from(users);
        const [companiesCount] = await db.select({ count: count() }).from(companies);
        const [interviewersCount] = await db.select({ count: count() }).from(interviewers);
        const [candidatesCount] = await db.select({ count: count() }).from(candidates);
        const [sessionsTotal] = await db.select({ count: count() }).from(interviewSessions);
        const [sessionsCompleted] = await db.select({ count: count() }).from(interviewSessions).where(eq(interviewSessions.status, 'COMPLETED'));
        const [sessionsPending] = await db.select({ count: count() }).from(interviewSessions).where(eq(interviewSessions.status, 'PENDING'));
        const [sessionsCancelled] = await db.select({ count: count() }).from(interviewSessions).where(eq(interviewSessions.status, 'CANCELLED'));
        const [scorecardsCount] = await db.select({ count: count() }).from(scorecards);

        return res.json({
            status: 'success',
            data: {
                users: usersCount.count,
                companies: companiesCount.count,
                interviewers: interviewersCount.count,
                candidates: candidatesCount.count,
                interviews: {
                    total: sessionsTotal.count,
                    completed: sessionsCompleted.count,
                    pending: sessionsPending.count,
                    cancelled: sessionsCancelled.count,
                    completionRate: sessionsTotal.count > 0
                        ? `${((Number(sessionsCompleted.count) / Number(sessionsTotal.count)) * 100).toFixed(1)}%`
                        : '0%',
                },
                scorecards: scorecardsCount.count,
            },
        });
    } catch (err) { next(err); }
});

// ─── Revenue Analytics ────────────────────────────────────────────────────────
router.get('/revenue', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        // Total revenue
        const [totalRevenue] = await db
            .select({ total: sum(paymentRecords.amount) })
            .from(paymentRecords)
            .where(eq(paymentRecords.status, 'COMPLETED'));

        // Revenue by type
        const revenueByType = await db
            .select({ type: paymentRecords.type, total: sum(paymentRecords.amount), orders: count() })
            .from(paymentRecords)
            .where(eq(paymentRecords.status, 'COMPLETED'))
            .groupBy(paymentRecords.type);

        // Payment status breakdown
        const statusBreakdown = await db
            .select({ status: paymentRecords.status, total: count() })
            .from(paymentRecords)
            .groupBy(paymentRecords.status);

        // Last 30 days revenue
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const [recentRevenue] = await db
            .select({ total: sum(paymentRecords.amount) })
            .from(paymentRecords)
            .where(and(
                eq(paymentRecords.status, 'COMPLETED'),
                gte(paymentRecords.createdAt, thirtyDaysAgo),
            ));

        const totalPaise = Number(totalRevenue.total || 0);
        const recentPaise = Number(recentRevenue.total || 0);

        return res.json({
            status: 'success',
            data: {
                totalRevenueINR: `₹${(totalPaise / 100).toLocaleString('en-IN')}`,
                totalRevenuePaise: totalPaise,
                last30DaysINR: `₹${(recentPaise / 100).toLocaleString('en-IN')}`,
                revenueByType: revenueByType.map((r) => ({
                    type: r.type,
                    totalINR: `₹${(Number(r.total || 0) / 100).toLocaleString('en-IN')}`,
                    orders: r.orders,
                })),
                statusBreakdown,
            },
        });
    } catch (err) { next(err); }
});

// ─── Interview Failure Tracking ───────────────────────────────────────────────
router.get('/failures', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const [cancelled] = await db.select({ count: count() }).from(interviewSessions).where(eq(interviewSessions.status, 'CANCELLED'));
        const [total] = await db.select({ count: count() }).from(interviewSessions);

        // Recent cancellations (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentCancellations = await db
            .select()
            .from(interviewSessions)
            .where(and(
                eq(interviewSessions.status, 'CANCELLED'),
                gte(interviewSessions.createdAt, sevenDaysAgo),
            ))
            .orderBy(interviewSessions.createdAt);

        // Payment failures
        const [failedPayments] = await db
            .select({ count: count() })
            .from(paymentRecords)
            .where(eq(paymentRecords.status, 'FAILED'));

        return res.json({
            status: 'success',
            data: {
                interviews: {
                    totalCancelled: cancelled.count,
                    cancellationRate: total.count > 0
                        ? `${((Number(cancelled.count) / Number(total.count)) * 100).toFixed(1)}%`
                        : '0%',
                    recentCancellations: recentCancellations.length,
                    recent: recentCancellations.slice(0, 20),
                },
                payments: {
                    totalFailed: failedPayments.count,
                },
            },
        });
    } catch (err) { next(err); }
});

// ─── Audit Log Viewer ─────────────────────────────────────────────────────────
router.get('/audit-logs', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
        const logs = await db
            .select()
            .from(auditLogs)
            .orderBy(sql`${auditLogs.createdAt} DESC`)
            .limit(limit);

        return res.json({ status: 'success', data: logs });
    } catch (err) { next(err); }
});

// ─── Anti-Cheat Reports (mounted here for admin access) ──────────────────────
router.get('/anticheat/:sessionId', getCheatReport);

export default router;
