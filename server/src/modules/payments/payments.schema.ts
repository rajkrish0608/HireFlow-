import { z } from 'zod';

// ─── Package definitions ──────────────────────────────────────────────────────
// Prices in INR paise (×100)
export const PACKAGES = {
    PER_INTERVIEW_STANDARD: {
        id: 'pkg_per_standard',
        name: 'Standard Technical Interview',
        type: 'PER_INTERVIEW' as const,
        amountPaise: 300000, // ₹3,000
        description: '60-min technical interview with senior interviewer',
    },
    PER_INTERVIEW_PREMIUM: {
        id: 'pkg_per_premium',
        name: 'Premium Technical Interview',
        type: 'PER_INTERVIEW' as const,
        amountPaise: 600000, // ₹6,000
        description: '90-min full-stack evaluation with lead interviewer',
    },
    BULK_5: {
        id: 'pkg_bulk_5',
        name: 'Bulk Pack – 5 Interviews',
        type: 'BULK' as const,
        amountPaise: 1250000, // ₹12,500 (save ₹2,500)
        description: '5 standard interviews at ₹2,500 each',
        quantity: 5,
    },
    BULK_10: {
        id: 'pkg_bulk_10',
        name: 'Bulk Pack – 10 Interviews',
        type: 'BULK' as const,
        amountPaise: 2000000, // ₹20,000 (save ₹10,000)
        description: '10 standard interviews at ₹2,000 each',
        quantity: 10,
    },
    SUBSCRIPTION_STARTER: {
        id: 'pkg_sub_starter',
        name: 'Starter Monthly Plan',
        type: 'SUBSCRIPTION' as const,
        amountPaise: 1500000, // ₹15,000/month
        description: 'Up to 5 interviews/month with dedicated support',
        interviewsIncluded: 5,
    },
    SUBSCRIPTION_GROWTH: {
        id: 'pkg_sub_growth',
        name: 'Growth Monthly Plan',
        type: 'SUBSCRIPTION' as const,
        amountPaise: 2500000, // ₹25,000/month
        description: 'Up to 15 interviews/month with priority matching',
        interviewsIncluded: 15,
    },
};

// ─── Zod Schemas ───────────────────────────────────────────────────────────────
export const createOrderSchema = z.object({
    packageId: z.enum([
        'pkg_per_standard',
        'pkg_per_premium',
        'pkg_bulk_5',
        'pkg_bulk_10',
        'pkg_sub_starter',
        'pkg_sub_growth',
    ]),
    companyId: z.string().uuid(),
    sessionId: z.string().uuid().optional(), // required for PER_INTERVIEW
    notes: z.string().optional(),
});

export const verifyPaymentSchema = z.object({
    razorpayOrderId: z.string(),
    razorpayPaymentId: z.string(),
    razorpaySignature: z.string(),
    paymentRecordId: z.string().uuid(),
});

export const payoutRequestSchema = z.object({
    interviewerId: z.string().uuid(),
    amount: z.number().int().min(100), // in INR paise
    accountNumber: z.string().min(9).max(18),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
    accountHolderName: z.string().min(2),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type PayoutRequestInput = z.infer<typeof payoutRequestSchema>;
