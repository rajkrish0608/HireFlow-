import crypto from 'crypto';
import { razorpay } from '../../lib/razorpay';
import { db } from '../../config/db';
import { paymentRecords, interviewers, users } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { config } from '../../config/env';
import { PACKAGES } from './payments.schema';
import type { CreateOrderInput, VerifyPaymentInput, PayoutRequestInput } from './payments.schema';

// ─── Create Razorpay Order ─────────────────────────────────────────────────────
export async function createPaymentOrder(input: CreateOrderInput) {
    const pkg = Object.values(PACKAGES).find((p) => p.id === input.packageId);
    if (!pkg) throw new Error('Package not found');

    // Create Razorpay order
    const order = await razorpay.orders.create({
        amount: pkg.amountPaise,
        currency: 'INR',
        receipt: `hireflow_${Date.now()}`,
        notes: {
            companyId: input.companyId,
            packageId: input.packageId,
            sessionId: input.sessionId || '',
        },
    });

    // Persist a PENDING payment record
    const [record] = await db.insert(paymentRecords).values({
        companyId: input.companyId,
        sessionId: input.sessionId || null,
        amount: pkg.amountPaise,
        type: pkg.type,
        status: 'PENDING',
        gatewayOrderId: order.id,
    }).returning();

    return {
        orderId: order.id,
        amount: pkg.amountPaise,
        currency: 'INR',
        keyId: config.razorpay.keyId,
        paymentRecordId: record.id,
        package: pkg,
    };
}

// ─── Verify Razorpay Signature & Confirm Payment ──────────────────────────────
export async function verifyAndConfirmPayment(input: VerifyPaymentInput) {
    // HMAC-SHA256 signature verification
    const body = `${input.razorpayOrderId}|${input.razorpayPaymentId}`;
    const expectedSignature = crypto
        .createHmac('sha256', config.razorpay.keySecret)
        .update(body)
        .digest('hex');

    const isValid = expectedSignature === input.razorpaySignature;

    if (!isValid) {
        // Mark as failed
        await db.update(paymentRecords)
            .set({ status: 'FAILED', updatedAt: new Date() })
            .where(eq(paymentRecords.id, input.paymentRecordId));
        throw new Error('Payment signature verification failed');
    }

    // Mark as completed
    const [updated] = await db.update(paymentRecords)
        .set({
            status: 'COMPLETED',
            gatewayPaymentId: input.razorpayPaymentId,
            updatedAt: new Date(),
        })
        .where(eq(paymentRecords.id, input.paymentRecordId))
        .returning();

    return updated;
}

// ─── Webhook Handler (for server-side confirmation) ───────────────────────────
export function verifyWebhookSignature(body: string, signature: string): boolean {
    const expected = crypto
        .createHmac('sha256', config.razorpay.webhookSecret)
        .update(body)
        .digest('hex');
    return expected === signature;
}

export async function handleWebhookEvent(event: Record<string, unknown>) {
    const eventType = event.event as string;
    const payload = event.payload as Record<string, unknown>;

    if (eventType === 'payment.captured') {
        const payment = (payload.payment as Record<string, unknown>).entity as Record<string, unknown>;
        const orderId = payment.order_id as string;

        await db.update(paymentRecords)
            .set({ status: 'COMPLETED', updatedAt: new Date() })
            .where(and(
                eq(paymentRecords.gatewayOrderId, orderId),
                eq(paymentRecords.status, 'PENDING'),
            ));
    }

    if (eventType === 'payment.failed') {
        const payment = (payload.payment as Record<string, unknown>).entity as Record<string, unknown>;
        const orderId = payment.order_id as string;

        await db.update(paymentRecords)
            .set({ status: 'FAILED', updatedAt: new Date() })
            .where(eq(paymentRecords.gatewayOrderId, orderId));
    }
}

// ─── Payment History ──────────────────────────────────────────────────────────
export async function getPaymentHistory(companyId: string) {
    const records = await db.select().from(paymentRecords)
        .where(eq(paymentRecords.companyId, companyId))
        .orderBy(paymentRecords.createdAt);

    const total = records
        .filter((r) => r.status === 'COMPLETED')
        .reduce((sum, r) => sum + r.amount, 0);

    return {
        records,
        totalSpentPaise: total,
        totalSpentINR: (total / 100).toFixed(2),
    };
}

// ─── Interviewer Payout (Mock – integrate with Razorpay X for live) ───────────
export async function requestInterviewerPayout(input: PayoutRequestInput) {
    // Real implementation: Razorpay X fund account + payout API
    // For now, we return a mock payout reference
    const payoutRef = `PAYOUT_${Date.now()}_${input.interviewerId.slice(0, 8).toUpperCase()}`;

    console.log(`[Payout] 💸 Payout request received:
    Interviewer : ${input.interviewerId}
    Amount      : ₹${(input.amount / 100).toFixed(2)}
    Account     : ****${input.accountNumber.slice(-4)}
    IFSC        : ${input.ifscCode}
    Ref         : ${payoutRef}
    `);

    return {
        payoutRef,
        status: 'QUEUED',
        message: 'Payout queued. Will be processed within 1–2 business days.',
        estimatedAmount: `₹${(input.amount / 100).toFixed(2)}`,
    };
}
