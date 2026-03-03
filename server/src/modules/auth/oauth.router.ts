import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';

const router = Router();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ─── GitHub OAuth ─────────────────────────────────────────────────────────────

// Redirect to GitHub login
router.get('/github', passport.authenticate('github', { session: false, scope: ['user:email'] }));

// GitHub callback
router.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${CLIENT_URL}/login?error=github_failed` }),
    (req: Request, res: Response) => {
        const { token } = req.user as unknown as { token: string };
        // Redirect to frontend with token as query param
        res.redirect(`${CLIENT_URL}/oauth/callback?token=${token}&provider=github`);
    }
);

// ─── LinkedIn OAuth ───────────────────────────────────────────────────────────

// Redirect to LinkedIn login
router.get('/linkedin', passport.authenticate('linkedin', { session: false }));

// LinkedIn callback
router.get('/linkedin/callback',
    passport.authenticate('linkedin', { session: false, failureRedirect: `${CLIENT_URL}/login?error=linkedin_failed` }),
    (req: Request, res: Response) => {
        const { token } = req.user as unknown as { token: string };
        res.redirect(`${CLIENT_URL}/oauth/callback?token=${token}&provider=linkedin`);
    }
);

export default router;
