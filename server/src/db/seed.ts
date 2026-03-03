import bcrypt from 'bcryptjs';
import { db, pool } from '../config/db';
import { users, companies, interviewers, candidates, jobRoles } from './schema';
import { config } from '../config/env';

async function seed() {
    console.log('[Seed] 🌱 Seeding development data...');

    try {
        const hash = (pw: string) => bcrypt.hash(pw, config.bcryptRounds);

        // ── Users
        const [admin, hrUser, interviewer1User, interviewer2User] = await db
            .insert(users)
            .values([
                {
                    email: 'admin@hireflow.dev',
                    passwordHash: await hash('Admin@123'),
                    role: 'ADMIN',
                },
                {
                    email: 'hr@acme.dev',
                    passwordHash: await hash('Hr@12345'),
                    role: 'HR',
                },
                {
                    email: 'senior.dev@hireflow.dev',
                    passwordHash: await hash('Inter@123'),
                    role: 'INTERVIEWER',
                },
                {
                    email: 'fullstack.lead@hireflow.dev',
                    passwordHash: await hash('Inter@456'),
                    role: 'INTERVIEWER',
                },
            ])
            .returning();

        console.log('[Seed] ✅ Users created');

        // ── Company
        const [acme] = await db
            .insert(companies)
            .values({
                name: 'Acme Technologies',
                size: '50-200',
                website: 'https://acme.dev',
                userId: hrUser.id,
            })
            .returning();

        console.log('[Seed] ✅ Company created');

        // ── Interviewers
        await db.insert(interviewers).values([
            {
                userId: interviewer1User.id,
                bio: 'Senior backend engineer with 8 years of experience in distributed systems.',
                skills: ['Node.js', 'PostgreSQL', 'System Design', 'TypeScript', 'Redis'],
                experienceYears: 8,
                rating: '4.9',
                hourlyRate: 5000,
            },
            {
                userId: interviewer2User.id,
                bio: 'Full-stack lead specializing in React ecosystems and cloud architecture.',
                skills: ['React', 'Next.js', 'AWS', 'Docker', 'TypeScript', 'GraphQL'],
                experienceYears: 6,
                rating: '4.7',
                hourlyRate: 4500,
            },
        ]);

        console.log('[Seed] ✅ Interviewers created');

        // ── Candidates
        await db.insert(candidates).values([
            {
                name: 'Arjun Sharma',
                email: 'arjun.sharma@example.com',
                skills: ['React', 'Node.js', 'TypeScript'],
                experienceYears: 3,
                companyId: acme.id,
            },
            {
                name: 'Priya Mehta',
                email: 'priya.mehta@example.com',
                skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
                experienceYears: 5,
                companyId: acme.id,
            },
        ]);

        console.log('[Seed] ✅ Candidates created');

        // ── Job Roles
        await db.insert(jobRoles).values([
            {
                title: 'Senior Backend Engineer',
                description: 'Build and scale microservices for our hiring platform.',
                skills: ['Node.js', 'PostgreSQL', 'TypeScript', 'Redis', 'System Design'],
                seniority: 'SENIOR',
                companyId: acme.id,
            },
            {
                title: 'Mid-level Frontend Engineer',
                description: 'Build premium UI components using React and design systems.',
                skills: ['React', 'TypeScript', 'CSS', 'Framer Motion'],
                seniority: 'MID',
                companyId: acme.id,
            },
        ]);

        console.log('[Seed] ✅ Job roles created');
        console.log('[Seed] 🎉 Seed complete!');
        console.log('\n── Seeded Accounts ──────────────────────────');
        console.log('Admin     → admin@hireflow.dev   / Admin@123');
        console.log('HR        → hr@acme.dev          / Hr@12345');
        console.log('Interviewer 1 → senior.dev@hireflow.dev / Inter@123');
        console.log('Interviewer 2 → fullstack.lead@hireflow.dev / Inter@456');
        console.log('─────────────────────────────────────────────');
    } catch (error) {
        console.error('[Seed] ❌ Seed failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

seed();
