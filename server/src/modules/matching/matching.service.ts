import { db } from '../../config/db';
import { interviewers, jobRoles, users } from '../../db/schema';
import { eq } from 'drizzle-orm';

interface MatchedInterviewer {
    interviewerId: string;
    email: string;
    bio: string | null;
    skills: string[];
    experienceYears: number;
    rating: string;
    totalInterviews: number;
    hourlyRate: number;
    matchScore: number;
    matchedSkills: string[];
}

export async function matchInterviewers(jobRoleId: string): Promise<MatchedInterviewer[]> {
    // 1. Get required skills for the job role
    const [role] = await db.select().from(jobRoles).where(eq(jobRoles.id, jobRoleId));
    if (!role) throw new Error('Job role not found');

    const requiredSkills = role.skills.map((s) => s.toLowerCase().trim());

    // 2. Fetch all available interviewers with their user info
    const allInterviewers = await db
        .select({
            interviewer: interviewers,
            user: users,
        })
        .from(interviewers)
        .innerJoin(users, eq(users.id, interviewers.userId))
        .where(eq(interviewers.isAvailable, true));

    // 3. Score each interviewer based on skill overlap
    const scored: MatchedInterviewer[] = allInterviewers
        .filter((row) => parseFloat(row.interviewer.rating) >= 3.5)
        .map((row) => {
            const interviewerSkills = row.interviewer.skills.map((s) => s.toLowerCase().trim());
            const matchedSkills = interviewerSkills.filter((s) => requiredSkills.includes(s));
            const matchScore = requiredSkills.length > 0
                ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
                : 0;

            return {
                interviewerId: row.interviewer.id,
                email: row.user.email,
                bio: row.interviewer.bio,
                skills: row.interviewer.skills,
                experienceYears: row.interviewer.experienceYears,
                rating: row.interviewer.rating,
                totalInterviews: row.interviewer.totalInterviews,
                hourlyRate: row.interviewer.hourlyRate,
                matchScore,
                matchedSkills,
            };
        })
        .filter((m) => m.matchScore > 0)
        .sort((a, b) => {
            // Sort by matchScore DESC, then rating DESC
            if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
            return parseFloat(b.rating) - parseFloat(a.rating);
        })
        .slice(0, 5); // Top 5 matches

    return scored;
}
