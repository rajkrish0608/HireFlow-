import { db } from '../../config/db';
import { candidates } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { CreateCandidateInput } from './candidates.schema';

export async function createCandidate(data: CreateCandidateInput) {
    const [candidate] = await db.insert(candidates).values({
        name: data.name,
        email: data.email,
        skills: data.skills,
        experienceYears: data.experienceYears,
        resumeUrl: data.resumeUrl,
        companyId: data.companyId,
    }).returning();
    return candidate;
}

export async function listCandidates(companyId: string) {
    return db.select().from(candidates).where(eq(candidates.companyId, companyId)).orderBy(candidates.createdAt);
}

export async function getCandidateById(id: string) {
    const [candidate] = await db.select().from(candidates).where(eq(candidates.id, id));
    return candidate ?? null;
}
