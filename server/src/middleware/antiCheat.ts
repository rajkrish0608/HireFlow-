import type { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';

const CHEAT_PREFIX = 'anticheat:';
const TAB_SWITCH_LIMIT = 5;
const COPY_PASTE_LIMIT = 3;
const SUSPICIOUS_SPEED_CHARS_PER_SEC = 50; // typing faster than this is suspicious

interface CheatingEvent {
    type: 'TAB_SWITCH' | 'COPY_PASTE' | 'SUSPICIOUS_SPEED' | 'DEVTOOLS_DETECTED';
    timestamp: string;
    details?: string;
}

/**
 * Records an anti-cheat event for a coding session.
 * Called from the frontend when it detects suspicious activity.
 * POST /api/coding/anticheat/report
 */
export async function recordCheatEvent(req: Request, res: Response, next: NextFunction) {
    try {
        const { sessionId, type, details } = req.body as {
            sessionId: string;
            type: CheatingEvent['type'];
            details?: string;
        };

        if (!sessionId || !type) {
            return res.status(400).json({ status: 'error', message: 'sessionId and type required' });
        }

        const key = `${CHEAT_PREFIX}${sessionId}`;
        const event: CheatingEvent = {
            type,
            timestamp: new Date().toISOString(),
            details,
        };

        // Append event to a Redis list (expiry 24h)
        await redis.rpush(key, JSON.stringify(event));
        await redis.expire(key, 86400);

        // Count violations by type
        const events = await redis.lrange(key, 0, -1);
        const parsed = events.map((e) => JSON.parse(e) as CheatingEvent);
        const tabSwitches = parsed.filter((e) => e.type === 'TAB_SWITCH').length;
        const copyPastes = parsed.filter((e) => e.type === 'COPY_PASTE').length;

        const flagged = tabSwitches >= TAB_SWITCH_LIMIT || copyPastes >= COPY_PASTE_LIMIT;

        return res.json({
            status: 'success',
            data: {
                recorded: true,
                totalViolations: parsed.length,
                flagged,
                warning: flagged
                    ? '⚠️ Excessive violations detected. This session will be flagged for review.'
                    : null,
            },
        });
    } catch (err) { next(err); }
}

/**
 * Returns all cheat events for a session (for interviewer/admin review).
 * GET /api/coding/anticheat/:sessionId
 */
export async function getCheatReport(req: Request, res: Response, next: NextFunction) {
    try {
        const { sessionId } = req.params;
        const key = `${CHEAT_PREFIX}${sessionId}`;
        const events = await redis.lrange(key, 0, -1);
        const parsed = events.map((e) => JSON.parse(e) as CheatingEvent);

        const tabSwitches = parsed.filter((e) => e.type === 'TAB_SWITCH').length;
        const copyPastes = parsed.filter((e) => e.type === 'COPY_PASTE').length;
        const suspiciousSpeed = parsed.filter((e) => e.type === 'SUSPICIOUS_SPEED').length;
        const devtools = parsed.filter((e) => e.type === 'DEVTOOLS_DETECTED').length;

        return res.json({
            status: 'success',
            data: {
                sessionId,
                totalEvents: parsed.length,
                flagged: tabSwitches >= TAB_SWITCH_LIMIT || copyPastes >= COPY_PASTE_LIMIT,
                summary: { tabSwitches, copyPastes, suspiciousSpeed, devtools },
                events: parsed,
            },
        });
    } catch (err) { next(err); }
}
