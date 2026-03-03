import {
    pgTable,
    uuid,
    varchar,
    text,
    integer,
    decimal,
    boolean,
    timestamp,
    pgEnum,
    jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role', ['HR', 'INTERVIEWER', 'ADMIN']);

export const interviewStatusEnum = pgEnum('interview_status', [
    'PENDING',
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
]);

export const recommendationEnum = pgEnum('recommendation', [
    'STRONG_HIRE',
    'HIRE',
    'NO_HIRE',
]);

export const paymentTypeEnum = pgEnum('payment_type', [
    'PER_INTERVIEW',
    'SUBSCRIPTION',
    'BULK',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED',
]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').notNull().default('HR'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Companies ────────────────────────────────────────────────────────────────

export const companies = pgTable('companies', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    size: varchar('size', { length: 50 }), // e.g. "20-100", "100-300"
    website: varchar('website', { length: 255 }),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Interviewers ─────────────────────────────────────────────────────────────

export const interviewers = pgTable('interviewers', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .unique()
        .references(() => users.id, { onDelete: 'cascade' }),
    bio: text('bio'),
    skills: text('skills').array().notNull().default([]),
    experienceYears: integer('experience_years').notNull().default(0),
    rating: decimal('rating', { precision: 3, scale: 2 }).notNull().default('5.0'),
    totalInterviews: integer('total_interviews').notNull().default(0),
    isAvailable: boolean('is_available').notNull().default(true),
    hourlyRate: integer('hourly_rate').notNull().default(3000), // in INR
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Candidates ───────────────────────────────────────────────────────────────

export const candidates = pgTable('candidates', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    skills: text('skills').array().notNull().default([]),
    experienceYears: integer('experience_years').notNull().default(0),
    resumeUrl: text('resume_url'),
    companyId: uuid('company_id')
        .notNull()
        .references(() => companies.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Job Roles ────────────────────────────────────────────────────────────────

export const jobRoles = pgTable('job_roles', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    skills: text('skills').array().notNull().default([]),
    seniority: varchar('seniority', { length: 50 }).notNull(), // JUNIOR, MID, SENIOR
    isActive: boolean('is_active').notNull().default(true),
    companyId: uuid('company_id')
        .notNull()
        .references(() => companies.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Interview Sessions ───────────────────────────────────────────────────────

export const interviewSessions = pgTable('interview_sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    candidateId: uuid('candidate_id')
        .notNull()
        .references(() => candidates.id, { onDelete: 'cascade' }),
    interviewerId: uuid('interviewer_id')
        .notNull()
        .references(() => interviewers.id),
    jobRoleId: uuid('job_role_id')
        .notNull()
        .references(() => jobRoles.id),
    status: interviewStatusEnum('status').notNull().default('PENDING'),
    scheduledAt: timestamp('scheduled_at'),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    durationMinutes: integer('duration_minutes').notNull().default(60),
    recordingUrl: text('recording_url'),
    meetingUrl: text('meeting_url'),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Scorecards ───────────────────────────────────────────────────────────────

export const scorecards = pgTable('scorecards', {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
        .notNull()
        .unique()
        .references(() => interviewSessions.id, { onDelete: 'cascade' }),
    rubricScores: jsonb('rubric_scores').notNull(), // { technicalDepth: 8, communication: 7, problemSolving: 9, ... }
    overallScore: decimal('overall_score', { precision: 4, scale: 2 }).notNull(),
    recommendation: recommendationEnum('recommendation').notNull(),
    strengths: text('strengths'),
    improvements: text('improvements'),
    summary: text('summary'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Payment Records ──────────────────────────────────────────────────────────

export const paymentRecords = pgTable('payment_records', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id')
        .notNull()
        .references(() => companies.id),
    sessionId: uuid('session_id').references(() => interviewSessions.id),
    amount: integer('amount').notNull(), // in INR paise
    type: paymentTypeEnum('type').notNull(),
    status: paymentStatusEnum('status').notNull().default('PENDING'),
    gatewayOrderId: varchar('gateway_order_id', { length: 255 }),
    gatewayPaymentId: varchar('gateway_payment_id', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const auditLogs = pgTable('audit_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id),
    action: varchar('action', { length: 100 }).notNull(), // AUTH_LOGIN, AUTH_REGISTER, etc.
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
    company: one(companies, { fields: [users.id], references: [companies.userId] }),
    interviewer: one(interviewers, { fields: [users.id], references: [interviewers.userId] }),
    auditLogs: many(auditLogs),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
    user: one(users, { fields: [companies.userId], references: [users.id] }),
    candidates: many(candidates),
    jobRoles: many(jobRoles),
    payments: many(paymentRecords),
}));

export const interviewersRelations = relations(interviewers, ({ one, many }) => ({
    user: one(users, { fields: [interviewers.userId], references: [users.id] }),
    sessions: many(interviewSessions),
}));

export const candidatesRelations = relations(candidates, ({ one, many }) => ({
    company: one(companies, { fields: [candidates.companyId], references: [companies.id] }),
    sessions: many(interviewSessions),
}));

export const jobRolesRelations = relations(jobRoles, ({ one, many }) => ({
    company: one(companies, { fields: [jobRoles.companyId], references: [companies.id] }),
    sessions: many(interviewSessions),
}));

export const interviewSessionsRelations = relations(interviewSessions, ({ one }) => ({
    candidate: one(candidates, { fields: [interviewSessions.candidateId], references: [candidates.id] }),
    interviewer: one(interviewers, { fields: [interviewSessions.interviewerId], references: [interviewers.id] }),
    jobRole: one(jobRoles, { fields: [interviewSessions.jobRoleId], references: [jobRoles.id] }),
    scorecard: one(scorecards, { fields: [interviewSessions.id], references: [scorecards.sessionId] }),
    payment: one(paymentRecords, { fields: [interviewSessions.id], references: [paymentRecords.sessionId] }),
}));

export const scorecardsRelations = relations(scorecards, ({ one }) => ({
    session: one(interviewSessions, { fields: [scorecards.sessionId], references: [interviewSessions.id] }),
}));

export const paymentRecordsRelations = relations(paymentRecords, ({ one }) => ({
    company: one(companies, { fields: [paymentRecords.companyId], references: [companies.id] }),
    session: one(interviewSessions, { fields: [paymentRecords.sessionId], references: [interviewSessions.id] }),
}));
