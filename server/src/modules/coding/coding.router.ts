import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { startCodingChallenge, getChallenge, submitSolution, getSubmission } from './coding.service';

const router = Router();
router.use(authenticate);

const startSchema = z.object({
    sessionId: z.string().uuid(),
    language: z.enum(['javascript', 'python', 'java', 'cpp']),
    durationSeconds: z.number().int().min(900).max(7200).default(3600),
    problem: z.object({
        title: z.string(),
        description: z.string(),
        examples: z.array(z.string()).default([]),
        constraints: z.array(z.string()).default([]),
    }),
});

// POST /api/coding/challenge/start
router.post('/challenge/start', authorize('INTERVIEWER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = startSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.flatten().fieldErrors });

        const config = await startCodingChallenge(
            parsed.data.sessionId,
            parsed.data.language,
            parsed.data.problem,
            parsed.data.durationSeconds,
        );
        return res.status(201).json({ status: 'success', data: config });
    } catch (err) { next(err); }
});

// POST /api/coding/challenge/submit
router.post('/challenge/submit', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sessionId, code, language } = req.body as { sessionId: string; code: string; language: string };
        if (!sessionId || !code || !language) {
            return res.status(400).json({ status: 'error', message: 'sessionId, code, language required' });
        }

        const result = await submitSolution(sessionId, code, language);
        if (!result) return res.status(500).json({ status: 'error', message: 'Submission failed' });

        const statusCode = result.status === 'TIMEOUT' ? 408 : 200;
        return res.status(statusCode).json({ status: result.status === 'TIMEOUT' ? 'error' : 'success', data: result });
    } catch (err) { next(err); }
});

// GET /api/coding/challenge/:sessionId
router.get('/challenge/:sessionId', authorize('INTERVIEWER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const active = await getChallenge(req.params.sessionId);
        const submission = await getSubmission(req.params.sessionId);

        if (!active && !submission) {
            return res.status(404).json({ status: 'error', message: 'Challenge session not found or expired' });
        }

        return res.json({
            status: 'success',
            data: {
                active: active ?? null,
                submission: submission ?? null,
            },
        });
    } catch (err) { next(err); }
});

export default router;
