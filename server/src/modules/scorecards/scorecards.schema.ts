import { z } from 'zod';

export const submitScorecardSchema = z.object({
    sessionId: z.string().uuid(),
    rubricScores: z.object({
        technicalDepth: z.number().min(1).max(10),
        problemSolving: z.number().min(1).max(10),
        communication: z.number().min(1).max(10),
        culturalFit: z.number().min(1).max(10),
    }),
    recommendation: z.enum(['STRONG_HIRE', 'HIRE', 'NO_HIRE']),
    strengths: z.string().optional(),
    improvements: z.string().optional(),
    summary: z.string().optional(),
});

export type SubmitScorecardInput = z.infer<typeof submitScorecardSchema>;
