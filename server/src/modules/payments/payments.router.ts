import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { createOrderSchema, verifyPaymentSchema, payoutRequestSchema, PACKAGES } from './payments.schema';
import {
    createPaymentOrder,
    verifyAndConfirmPayment,
    getPaymentHistory,
    verifyWebhookSignature,
    handleWebhookEvent,
    requestInterviewerPayout,
} from './payments.service';

const router = Router();

// ─── Packages Catalogue (public) ─────────────────────────────────────────────
router.get('/packages', (_req, res) => {
    res.json({ status: 'success', data: Object.values(PACKAGES) });
});

// ─── Protected routes ─────────────────────────────────────────────────────────
router.use(authenticate);

// POST /api/payments/order → Create Razorpay order
router.post('/order', authorize('HR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = createOrderSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.flatten().fieldErrors });

        const orderData = await createPaymentOrder(parsed.data);
        return res.status(201).json({ status: 'success', data: orderData });
    } catch (err) { next(err); }
});

// POST /api/payments/verify → Verify signature + confirm payment
router.post('/verify', authorize('HR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = verifyPaymentSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.flatten().fieldErrors });

        const record = await verifyAndConfirmPayment(parsed.data);
        return res.json({ status: 'success', data: record });
    } catch (err: unknown) {
        if (err instanceof Error && err.message.includes('signature')) {
            return res.status(400).json({ status: 'error', message: err.message });
        }
        next(err);
    }
});

// GET /api/payments/history?companyId=:id → Payment history
router.get('/history', authorize('HR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyId } = req.query as { companyId: string };
        if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId required' });

        const history = await getPaymentHistory(companyId);
        return res.json({ status: 'success', data: history });
    } catch (err) { next(err); }
});

// POST /api/payments/payout → Interviewer payout request
router.post('/payout', authorize('INTERVIEWER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = payoutRequestSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.flatten().fieldErrors });

        const result = await requestInterviewerPayout(parsed.data);
        return res.json({ status: 'success', data: result });
    } catch (err) { next(err); }
});

// ─── Razorpay Webhook (no auth – signature verified internally) ────────────────
router.post(
    '/webhook',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const signature = req.headers['x-razorpay-signature'] as string;
            const rawBody = JSON.stringify(req.body);

            if (!verifyWebhookSignature(rawBody, signature)) {
                return res.status(400).json({ status: 'error', message: 'Invalid webhook signature' });
            }

            await handleWebhookEvent(req.body as Record<string, unknown>);
            return res.json({ status: 'success' });
        } catch (err) { next(err); }
    }
);

export default router;
