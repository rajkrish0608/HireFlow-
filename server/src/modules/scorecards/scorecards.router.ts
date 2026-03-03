import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { submitScorecardSchema } from './scorecards.schema';
import { submitScorecard, getScorecardBySession, generateReportData } from './scorecards.service';

const router = Router();
router.use(authenticate);

// POST /api/scorecard/submit
router.post('/submit', authorize('INTERVIEWER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = submitScorecardSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.flatten().fieldErrors });

        const card = await submitScorecard(parsed.data);
        return res.status(201).json({ status: 'success', data: card });
    } catch (err) { next(err); }
});

// GET /api/scorecard/:sessionId
router.get('/:sessionId', authorize('HR', 'INTERVIEWER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const card = await getScorecardBySession(req.params.sessionId);
        if (!card) return res.status(404).json({ status: 'error', message: 'Scorecard not found' });
        return res.json({ status: 'success', data: card });
    } catch (err) { next(err); }
});

// GET /api/report/download/:sessionId → returns structured JSON data for PDF generation
router.get('/report/:sessionId', authorize('HR', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const report = await generateReportData(req.params.sessionId);
        if (!report) return res.status(404).json({ status: 'error', message: 'Report data not found' });
        return res.json({ status: 'success', data: report });
    } catch (err) { next(err); }
});

export default router;
