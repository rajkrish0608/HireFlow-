import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { db } from '../../config/db';
import { paymentRecords, interviewers } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';

const router = Router();
router.use(authenticate);

// GET /api/earnings → Interviewer's monthly earnings aggregation
router.get('/', authorize('INTERVIEWER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const interviewerId = req.query.interviewerId as string;
        if (!interviewerId) return res.status(400).json({ status: 'error', message: 'interviewerId required' });

        // Get interviewer profile
        const [interviewer] = await db.select().from(interviewers).where(eq(interviewers.id, interviewerId));
        if (!interviewer) return res.status(404).json({ status: 'error', message: 'Interviewer not found' });

        // Aggregate total earnings from completed payments
        const payments = await db
            .select()
            .from(paymentRecords)
            .where(and(
                eq(paymentRecords.status, 'COMPLETED'),
                eq(paymentRecords.type, 'PER_INTERVIEW'),
            ));

        // Group by month in application layer for DB agnosticism
        const monthly: Record<string, { month: string; totalAmount: number; count: number }> = {};

        for (const payment of payments) {
            const monthKey = payment.createdAt.toISOString().slice(0, 7); // "2026-03"
            if (!monthly[monthKey]) {
                monthly[monthKey] = { month: monthKey, totalAmount: 0, count: 0 };
            }
            monthly[monthKey].totalAmount += payment.amount;
            monthly[monthKey].count += 1;
        }

        const history = Object.values(monthly).sort((a, b) => b.month.localeCompare(a.month));
        const totalEarnings = history.reduce((sum, m) => sum + m.totalAmount, 0);
        const totalInterviews = interviewer.totalInterviews;
        const rating = interviewer.rating;

        return res.json({
            status: 'success',
            data: {
                summary: { totalEarnings, totalInterviews, rating, hourlyRate: interviewer.hourlyRate },
                monthly: history,
            },
        });
    } catch (err) { next(err); }
});

export default router;
