import { db } from '../../config/db';
import { jobRoles } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import type { CreateJobRoleInput, UpdateJobRoleInput } from './jobs.schema';

export async function createJobRole(data: CreateJobRoleInput) {
    const [role] = await db.insert(jobRoles).values({
        title: data.title,
        description: data.description,
        skills: data.skills,
        seniority: data.seniority,
        companyId: data.companyId,
    }).returning();
    return role;
}

export async function listJobRoles(companyId: string, filters?: { isActive?: boolean }) {
    const conditions = [eq(jobRoles.companyId, companyId)];
    if (filters?.isActive !== undefined) {
        conditions.push(eq(jobRoles.isActive, filters.isActive));
    }
    return db.select().from(jobRoles).where(and(...conditions)).orderBy(jobRoles.createdAt);
}

export async function getJobRole(id: string) {
    const [role] = await db.select().from(jobRoles).where(eq(jobRoles.id, id));
    return role ?? null;
}

export async function updateJobRole(id: string, data: UpdateJobRoleInput) {
    const [updated] = await db
        .update(jobRoles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(jobRoles.id, id))
        .returning();
    return updated ?? null;
}

export async function deactivateJobRole(id: string) {
    return updateJobRole(id, { isActive: false });
}
