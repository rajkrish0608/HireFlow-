import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { matchInterviewers } from './matching.service';

const router = Router();
router.use(authenticate);

// GET /api/interviewer/match?jobRoleId=:id
router.get('/match', authorize('HR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { jobRoleId } = req.query as { jobRoleId: string };
        if (!jobRoleId) return res.status(400).json({ status: 'error', message: 'jobRoleId query param required' });

        const matches = await matchInterviewers(jobRoleId);
        return res.json({
            status: 'success',
            count: matches.length,
            data: matches,
        });
    } catch (err) { next(err); }
});

export default router;
