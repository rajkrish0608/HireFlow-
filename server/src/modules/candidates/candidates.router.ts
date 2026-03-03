import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import type { Request, Response, NextFunction } from 'express';
import { createCandidateSchema } from './candidates.schema';
import { createCandidate, listCandidates, getCandidateById } from './candidates.service';

const router = Router();
router.use(authenticate);

router.post('/', authorize('HR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = createCandidateSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.flatten().fieldErrors });
        const candidate = await createCandidate(parsed.data);
        return res.status(201).json({ status: 'success', data: candidate });
    } catch (err) { next(err); }
});

router.get('/', authorize('HR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyId = req.query.companyId as string;
        if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId required' });
        const list = await listCandidates(companyId);
        return res.json({ status: 'success', data: list });
    } catch (err) { next(err); }
});

router.get('/:id', authorize('HR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const candidate = await getCandidateById(req.params.id);
        if (!candidate) return res.status(404).json({ status: 'error', message: 'Candidate not found' });
        return res.json({ status: 'success', data: candidate });
    } catch (err) { next(err); }
});

export default router;
