import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { db } from '../../config/db';
import {
    companies, candidates, interviewSessions, scorecards, paymentRecords, jobRoles,
} from '../../db/schema';
import { eq, and, gte, count, sum, sql, avg } from 'drizzle-orm';

const router = Router();
router.use(authenticate);
router.use(authorize('HR', 'ADMIN'));

/**
 * GET /api/enterprise/analytics?companyId=xxx
 * Company-specific analytics: hiring funnel, cost-per-hire, time-to-hire, top skills.
 */
router.get('/analytics', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyId } = req.query as { companyId: string };
        if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId required' });

        // Verify company exists
        const [company] = await db.select().from(companies).where(eq(companies.id, companyId));
        if (!company) return res.status(404).json({ status: 'error', message: 'Company not found' });

        // ─── Hiring Funnel ────────────────────────────────────────
        const [totalCandidates] = await db.select({ count: count() }).from(candidates).where(eq(candidates.companyId, companyId));

        const allSessions = await db
            .select()
            .from(interviewSessions)
            .innerJoin(candidates, eq(candidates.id, interviewSessions.candidateId))
            .where(eq(candidates.companyId, companyId));

        const completed = allSessions.filter((s) => s.interview_sessions.status === 'COMPLETED');
        const pending = allSessions.filter((s) => s.interview_sessions.status === 'PENDING');
        const cancelled = allSessions.filter((s) => s.interview_sessions.status === 'CANCELLED');

        // ─── Strong hires (recommendations from completed sessions) ──
        let strongHires = 0;
        let hires = 0;
        for (const s of completed) {
            const [card] = await db.select().from(scorecards).where(eq(scorecards.sessionId, s.interview_sessions.id));
            if (card?.recommendation === 'STRONG_HIRE') strongHires++;
            if (card?.recommendation === 'HIRE' || card?.recommendation === 'STRONG_HIRE') hires++;
        }

        // ─── Cost per hire ────────────────────────────────────────
        const [totalSpend] = await db
            .select({ total: sum(paymentRecords.amount) })
            .from(paymentRecords)
            .where(and(eq(paymentRecords.companyId, companyId), eq(paymentRecords.status, 'COMPLETED')));

        const totalSpentPaise = Number(totalSpend.total || 0);
        const costPerHire = hires > 0 ? Math.round(totalSpentPaise / hires) : 0;

        // ─── Average time-to-hire ─────────────────────────────────
        const completedWithDates = completed.filter(
            (s) => s.interview_sessions.scheduledAt && s.interview_sessions.completedAt
        );
        let avgTimeToHireDays = 0;
        if (completedWithDates.length > 0) {
            const totalDays = completedWithDates.reduce((sum, s) => {
                const scheduled = new Date(s.interview_sessions.scheduledAt!).getTime();
                const completed = new Date(s.interview_sessions.completedAt!).getTime();
                return sum + (completed - scheduled) / (1000 * 60 * 60 * 24);
            }, 0);
            avgTimeToHireDays = parseFloat((totalDays / completedWithDates.length).toFixed(1));
        }

        // ─── Top in-demand skills ─────────────────────────────────
        const roles = await db.select().from(jobRoles).where(eq(jobRoles.companyId, companyId));
        const skillFreq: Record<string, number> = {};
        for (const role of roles) {
            for (const skill of role.skills) {
                const s = skill.toLowerCase();
                skillFreq[s] = (skillFreq[s] || 0) + 1;
            }
        }
        const topSkills = Object.entries(skillFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([skill, count]) => ({ skill, count }));

        return res.json({
            status: 'success',
            data: {
                company: { name: company.name, size: company.size },
                funnel: {
                    totalCandidates: totalCandidates.count,
                    totalInterviews: allSessions.length,
                    completed: completed.length,
                    pending: pending.length,
                    cancelled: cancelled.length,
                    strongHires,
                    hires,
                    conversionRate: allSessions.length > 0
                        ? `${((hires / allSessions.length) * 100).toFixed(1)}%`
                        : '0%',
                },
                economics: {
                    totalSpentINR: `₹${(totalSpentPaise / 100).toLocaleString('en-IN')}`,
                    costPerHireINR: `₹${(costPerHire / 100).toLocaleString('en-IN')}`,
                    averageTimeToHireDays: avgTimeToHireDays,
                },
                topSkills,
                activeRoles: roles.filter((r) => r.isActive).length,
                totalRoles: roles.length,
            },
        });
    } catch (err) { next(err); }
});

export default router;
