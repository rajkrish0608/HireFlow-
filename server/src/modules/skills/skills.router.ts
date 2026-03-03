import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { db } from '../../config/db';
import { scorecards, interviewSessions, candidates, jobRoles } from '../../db/schema';
import { eq, sql } from 'drizzle-orm';

const router = Router();
router.use(authenticate);

/**
 * GET /api/skills/performance?candidateId=xxx
 * Returns aggregated skill scores over time for a candidate.
 * Useful for tracking improvement across multiple interviews.
 */
router.get('/performance', authorize('HR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { candidateId } = req.query as { candidateId: string };
        if (!candidateId) return res.status(400).json({ status: 'error', message: 'candidateId required' });

        // Get all completed sessions for this candidate
        const sessions = await db
            .select({
                session: interviewSessions,
                scorecard: scorecards,
                jobRole: jobRoles,
            })
            .from(interviewSessions)
            .innerJoin(scorecards, eq(scorecards.sessionId, interviewSessions.id))
            .innerJoin(jobRoles, eq(jobRoles.id, interviewSessions.jobRoleId))
            .where(eq(interviewSessions.candidateId, candidateId))
            .orderBy(interviewSessions.scheduledAt);

        if (sessions.length === 0) {
            return res.json({ status: 'success', data: { candidateId, sessions: [], aggregated: null } });
        }

        // Track scores over time per skill dimension
        const skillTimeline: Record<string, { date: string; score: number; role: string }[]> = {};
        const allScores: Record<string, number[]> = {};

        for (const row of sessions) {
            const rubric = row.scorecard.rubricScores as Record<string, number>;
            const date = row.session.scheduledAt?.toISOString() || '';
            const role = row.jobRole.title;

            for (const [skill, score] of Object.entries(rubric)) {
                if (!skillTimeline[skill]) skillTimeline[skill] = [];
                if (!allScores[skill]) allScores[skill] = [];
                skillTimeline[skill].push({ date, score, role });
                allScores[skill].push(score);
            }
        }

        // Calculate averages and trend (improving/declining/stable)
        const aggregated: Record<string, { average: number; latest: number; trend: string; count: number }> = {};
        for (const [skill, scores] of Object.entries(allScores)) {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            const latest = scores[scores.length - 1];
            const first = scores[0];
            let trend = 'STABLE';
            if (scores.length >= 2) {
                if (latest > first + 1) trend = 'IMPROVING';
                else if (latest < first - 1) trend = 'DECLINING';
            }
            aggregated[skill] = {
                average: parseFloat(avg.toFixed(2)),
                latest,
                trend,
                count: scores.length,
            };
        }

        return res.json({
            status: 'success',
            data: {
                candidateId,
                totalSessions: sessions.length,
                overallScore: parseFloat(
                    (sessions.reduce((sum, s) => sum + parseFloat(s.scorecard.overallScore), 0) / sessions.length).toFixed(2)
                ),
                skills: aggregated,
                timeline: skillTimeline,
            },
        });
    } catch (err) { next(err); }
});

/**
 * GET /api/skills/leaderboard
 * Returns top-performing interviewers by average rating and total interviews.
 */
router.get('/leaderboard', authorize('HR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { interviewers: interviewersTable } = await import('../../db/schema');
        const { users } = await import('../../db/schema');

        const leaderboard = await db
            .select({
                interviewerId: interviewersTable.id,
                email: users.email,
                rating: interviewersTable.rating,
                totalInterviews: interviewersTable.totalInterviews,
                skills: interviewersTable.skills,
                experienceYears: interviewersTable.experienceYears,
            })
            .from(interviewersTable)
            .innerJoin(users, eq(users.id, interviewersTable.userId))
            .where(eq(interviewersTable.isAvailable, true))
            .orderBy(sql`${interviewersTable.rating} DESC`)
            .limit(20);

        return res.json({ status: 'success', data: leaderboard });
    } catch (err) { next(err); }
});

export default router;
