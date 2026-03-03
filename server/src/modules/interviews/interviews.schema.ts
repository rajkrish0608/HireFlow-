import { z } from 'zod';

export const scheduleInterviewSchema = z.object({
    candidateId: z.string().uuid(),
    interviewerId: z.string().uuid(),
    jobRoleId: z.string().uuid(),
    scheduledAt: z.string().datetime({ message: 'Must be ISO 8601 datetime string' }),
    timezone: z.string().default('UTC'),
    durationMinutes: z.number().int().min(30).max(120).default(60),
    meetingUrl: z.string().url().optional(),
    notes: z.string().optional(),
});

export const updateStatusSchema = z.object({
    status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
});

export type ScheduleInterviewInput = z.infer<typeof scheduleInterviewSchema>;
