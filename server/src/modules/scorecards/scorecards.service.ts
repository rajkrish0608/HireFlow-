import { db } from '../../config/db';
import { scorecards, interviewSessions, candidates, jobRoles, interviewers, companies } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { SubmitScorecardInput } from './scorecards.schema';
import { sendScorecardEmail } from '../../lib/email';

export async function submitScorecard(data: SubmitScorecardInput) {
    const { rubricScores, recommendation, sessionId } = data;

    // Calculate overall score as weighted average of rubric scores
    const scores = Object.values(rubricScores);
    const overallScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);

    // Insert scorecard
    const [card] = await db.insert(scorecards).values({
        sessionId,
        rubricScores,
        overallScore,
        recommendation,
        strengths: data.strengths,
        improvements: data.improvements,
        summary: data.summary,
    }).returning();

    // Mark the session as COMPLETED
    await db.update(interviewSessions)
        .set({ status: 'COMPLETED', completedAt: new Date(), updatedAt: new Date() })
        .where(eq(interviewSessions.id, sessionId));

    // Try to notify HR
    try {
        const [session] = await db.select().from(interviewSessions).where(eq(interviewSessions.id, sessionId));
        const [candidate] = await db.select().from(candidates).where(eq(candidates.id, session.candidateId));
        const [role] = await db.select().from(jobRoles).where(eq(jobRoles.id, session.jobRoleId));
        const [company] = await db.select({
            userId: companies.userId,
        }).from(companies).where(eq(companies.id, candidate.companyId));

        if (company) {
            const [hrUserRow] = await db
                .select({ email: (await import('../../db/schema')).users.email })
                .from((await import('../../db/schema')).users)
                .where(eq((await import('../../db/schema')).users.id, company.userId));

            if (hrUserRow) {
                await sendScorecardEmail({
                    hrEmail: hrUserRow.email,
                    candidateName: candidate.name,
                    jobTitle: role.title,
                    recommendation,
                    overallScore: parseFloat(overallScore),
                });
            }
        }
    } catch (err) {
        console.error('[Scorecard] Email notification failed:', err);
    }

    return card;
}

export async function getScorecardBySession(sessionId: string) {
    const [card] = await db
        .select({
            scorecard: scorecards,
            session: interviewSessions,
        })
        .from(scorecards)
        .innerJoin(interviewSessions, eq(interviewSessions.id, scorecards.sessionId))
        .where(eq(scorecards.sessionId, sessionId));

    return card ?? null;
}

export async function generateReportData(sessionId: string) {
    const scorecard = await getScorecardBySession(sessionId);
    if (!scorecard) return null;

    const [candidate] = await db.select().from(candidates).where(
        eq(candidates.id, scorecard.session.candidateId)
    );
    const [role] = await db.select().from(jobRoles).where(
        eq(jobRoles.id, scorecard.session.jobRoleId)
    );
    const [interviewer] = await db.select().from(interviewers).where(
        eq(interviewers.id, scorecard.session.interviewerId)
    );

    return {
        session: {
            id: scorecard.session.id,
            scheduledAt: scorecard.session.scheduledAt,
            completedAt: scorecard.session.completedAt,
            durationMinutes: scorecard.session.durationMinutes,
        },
        candidate: candidate ? { name: candidate.name, email: candidate.email, skills: candidate.skills } : null,
        jobRole: role ? { title: role.title, seniority: role.seniority } : null,
        scorecard: {
            rubricScores: scorecard.scorecard.rubricScores,
            overallScore: scorecard.scorecard.overallScore,
            recommendation: scorecard.scorecard.recommendation,
            strengths: scorecard.scorecard.strengths,
            improvements: scorecard.scorecard.improvements,
            summary: scorecard.scorecard.summary,
        },
        generatedAt: new Date().toISOString(),
    };
}
