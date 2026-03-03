import { z } from 'zod';

export const createJobRoleSchema = z.object({
    title: z.string().min(3).max(255),
    description: z.string().optional(),
    skills: z.array(z.string()).min(1, 'At least one skill required'),
    seniority: z.enum(['JUNIOR', 'MID', 'SENIOR', 'LEAD']),
    companyId: z.string().uuid(),
});

export const updateJobRoleSchema = z.object({
    title: z.string().min(3).max(255).optional(),
    description: z.string().optional(),
    skills: z.array(z.string()).optional(),
    seniority: z.enum(['JUNIOR', 'MID', 'SENIOR', 'LEAD']).optional(),
    isActive: z.boolean().optional(),
});

export type CreateJobRoleInput = z.infer<typeof createJobRoleSchema>;
export type UpdateJobRoleInput = z.infer<typeof updateJobRoleSchema>;
