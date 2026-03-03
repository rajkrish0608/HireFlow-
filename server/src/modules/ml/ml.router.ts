import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { predictHireSuccess } from './prediction.service';

const router = Router();
router.use(authenticate);

// POST /api/ml/predict – Predicts hire success for a completed interview session
router.post('/predict', authorize('HR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sessionId } = req.body as { sessionId: string };
        if (!sessionId) return res.status(400).json({ status: 'error', message: 'sessionId required' });

        const prediction = await predictHireSuccess({ sessionId });
        if (!prediction) return res.status(404).json({ status: 'error', message: 'No scorecard found for this session' });

        return res.json({ status: 'success', data: prediction });
    } catch (err) { next(err); }
});

export default router;
