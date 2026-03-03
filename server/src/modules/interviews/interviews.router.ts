import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { scheduleInterviewSchema } from './interviews.schema';
import {
    scheduleInterview,
    listInterviewsForCompany,
    listInterviewsForInterviewer,
    getInterviewById,
    acceptInterview,
    declineInterview,
    completeInterview,
} from './interviews.service';

const router = Router();
router.use(authenticate);

// POST /api/interviews/schedule
router.post('/schedule', authorize('HR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = scheduleInterviewSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.flatten().fieldErrors });

        const session = await scheduleInterview(parsed.data);
        return res.status(201).json({ status: 'success', data: session });
    } catch (err) { next(err); }
});

// GET /api/interviews?type=hr&companyId=xxx  OR  ?type=interviewer&interviewerId=xxx
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, companyId, interviewerId } = req.query as Record<string, string>;

        if (type === 'hr' && companyId) {
            const sessions = await listInterviewsForCompany(companyId);
            return res.json({ status: 'success', data: sessions });
        }
        if (type === 'interviewer' && interviewerId) {
            const sessions = await listInterviewsForInterviewer(interviewerId);
            return res.json({ status: 'success', data: sessions });
        }
        return res.status(400).json({ status: 'error', message: 'Provide type (hr|interviewer) and relevant ID' });
    } catch (err) { next(err); }
});

// GET /api/interviews/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await getInterviewById(req.params.id);
        if (!session) return res.status(404).json({ status: 'error', message: 'Interview session not found' });
        return res.json({ status: 'success', data: session });
    } catch (err) { next(err); }
});

// PATCH /api/interviews/:id/accept
router.patch('/:id/accept', authorize('INTERVIEWER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        // req.user.interviewerId should be resolved from bearer token
        const interviewerId = (req as any).user?.interviewerId as string;
        if (!interviewerId) return res.status(403).json({ status: 'error', message: 'Interviewer profile required' });

        const session = await acceptInterview(req.params.id, interviewerId);
        if (!session) return res.status(404).json({ status: 'error', message: 'Session not found or cannot be accepted' });
        return res.json({ status: 'success', data: session });
    } catch (err) { next(err); }
});

// PATCH /api/interviews/:id/decline
router.patch('/:id/decline', authorize('INTERVIEWER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const interviewerId = (req as any).user?.interviewerId as string;
        if (!interviewerId) return res.status(403).json({ status: 'error', message: 'Interviewer profile required' });

        const session = await declineInterview(req.params.id, interviewerId);
        if (!session) return res.status(404).json({ status: 'error', message: 'Session not found' });
        return res.json({ status: 'success', data: session });
    } catch (err) { next(err); }
});

// PATCH /api/interviews/:id/complete
router.patch('/:id/complete', authorize('INTERVIEWER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await completeInterview(req.params.id);
        if (!session) return res.status(404).json({ status: 'error', message: 'Session not found' });
        return res.json({ status: 'success', data: session });
    } catch (err) { next(err); }
});

export default router;
