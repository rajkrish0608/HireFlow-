import { z } from 'zod';

export const createCandidateSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email(),
    skills: z.array(z.string()).default([]),
    experienceYears: z.number().int().min(0).default(0),
    resumeUrl: z.string().url().optional(),
    companyId: z.string().uuid(),
});

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
