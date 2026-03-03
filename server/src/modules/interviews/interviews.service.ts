import { db } from '../../config/db';
import { interviewSessions, candidates, interviewers, jobRoles, users } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { sendInterviewScheduledEmail } from '../../lib/email';
import type { ScheduleInterviewInput } from './interviews.schema';

export async function scheduleInterview(data: ScheduleInterviewInput) {
    // Dates are stored as UTC in PostgreSQL – JS Date from ISO string is always UTC
    const scheduledAt = new Date(data.scheduledAt);

    const [session] = await db.insert(interviewSessions).values({
        candidateId: data.candidateId,
        interviewerId: data.interviewerId,
        jobRoleId: data.jobRoleId,
        status: 'PENDING',
        scheduledAt,
        durationMinutes: data.durationMinutes,
        meetingUrl: data.meetingUrl,
        notes: data.notes,
    }).returning();

    // Fetch related data for the email notification
    try {
        const [candidate] = await db.select().from(candidates).where(eq(candidates.id, data.candidateId));
        const [interviewer] = await db.select({
            interviewer: interviewers,
            user: users,
        }).from(interviewers)
            .innerJoin(users, eq(users.id, interviewers.userId))
            .where(eq(interviewers.id, data.interviewerId));
        const [jobRole] = await db.select().from(jobRoles).where(eq(jobRoles.id, data.jobRoleId));

        if (candidate && interviewer && jobRole) {
            await sendInterviewScheduledEmail({
                candidateEmail: candidate.email,
                candidateName: candidate.name,
                interviewerEmail: interviewer.user.email,
                interviewerName: `Expert (${interviewer.user.email})`,
                jobTitle: jobRole.title,
                scheduledAt,
                timezone: data.timezone,
                meetingUrl: data.meetingUrl,
            });
        }
    } catch (emailErr) {
        console.error('[Interview] Email notification failed:', emailErr);
        // Non-blocking – session created successfully
    }

    return session;
}

export async function listInterviewsForCompany(companyId: string) {
    // Get all sessions for candidates belonging to this company
    const result = await db
        .select({
            session: interviewSessions,
            candidate: candidates,
            jobRole: jobRoles,
        })
        .from(interviewSessions)
        .innerJoin(candidates, eq(candidates.id, interviewSessions.candidateId))
        .innerJoin(jobRoles, eq(jobRoles.id, interviewSessions.jobRoleId))
        .where(eq(candidates.companyId, companyId))
        .orderBy(interviewSessions.scheduledAt);

    return result;
}

export async function listInterviewsForInterviewer(interviewerId: string) {
    return db
        .select({ session: interviewSessions, candidate: candidates, jobRole: jobRoles })
        .from(interviewSessions)
        .innerJoin(candidates, eq(candidates.id, interviewSessions.candidateId))
        .innerJoin(jobRoles, eq(jobRoles.id, interviewSessions.jobRoleId))
        .where(eq(interviewSessions.interviewerId, interviewerId))
        .orderBy(interviewSessions.scheduledAt);
}

export async function getInterviewById(id: string) {
    const [session] = await db
        .select()
        .from(interviewSessions)
        .where(eq(interviewSessions.id, id));
    return session ?? null;
}

export async function acceptInterview(sessionId: string, interviewerId: string) {
    const [updated] = await db
        .update(interviewSessions)
        .set({ status: 'SCHEDULED', updatedAt: new Date() })
        .where(and(
            eq(interviewSessions.id, sessionId),
            eq(interviewSessions.interviewerId, interviewerId),
            eq(interviewSessions.status, 'PENDING'),
        ))
        .returning();
    return updated ?? null;
}

export async function declineInterview(sessionId: string, interviewerId: string) {
    const [updated] = await db
        .update(interviewSessions)
        .set({ status: 'CANCELLED', updatedAt: new Date() })
        .where(and(
            eq(interviewSessions.id, sessionId),
            eq(interviewSessions.interviewerId, interviewerId),
        ))
        .returning();
    return updated ?? null;
}

export async function completeInterview(sessionId: string) {
    const [updated] = await db
        .update(interviewSessions)
        .set({
            status: 'COMPLETED',
            completedAt: new Date(),
            updatedAt: new Date(),
        })
        .where(eq(interviewSessions.id, sessionId))
        .returning();
    return updated ?? null;
}
