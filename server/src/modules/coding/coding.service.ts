import { redis } from '../../config/redis';

const CODING_SESSION_PREFIX = 'coding:session:';
const DEFAULT_TTL_SECONDS = 3600; // 60 minutes

export interface ChallengeConfig {
    sessionId: string;
    language: 'javascript' | 'python' | 'java' | 'cpp';
    problem: {
        title: string;
        description: string;
        examples: string[];
        constraints: string[];
    };
    durationSeconds: number;
    startedAt: string;
}

export interface SubmissionResult {
    submittedAt: string;
    language: string;
    code: string;
    status: 'SUBMITTED' | 'TIMEOUT';
    timeElapsedSeconds: number;
}

export async function startCodingChallenge(
    sessionId: string,
    language: ChallengeConfig['language'],
    problem: ChallengeConfig['problem'],
    durationSeconds: number = DEFAULT_TTL_SECONDS,
): Promise<ChallengeConfig> {
    const key = `${CODING_SESSION_PREFIX}${sessionId}`;

    // Check if already started
    const existing = await redis.get(key);
    if (existing) {
        return JSON.parse(existing) as ChallengeConfig;
    }

    const config: ChallengeConfig = {
        sessionId,
        language,
        problem,
        durationSeconds,
        startedAt: new Date().toISOString(),
    };

    // Store with TTL to enforce time-bound session
    await redis.setex(key, durationSeconds, JSON.stringify(config));
    return config;
}

export async function getChallenge(sessionId: string): Promise<{ config: ChallengeConfig; remainingSeconds: number } | null> {
    const key = `${CODING_SESSION_PREFIX}${sessionId}`;
    const [raw, ttl] = await Promise.all([
        redis.get(key),
        redis.ttl(key),
    ]);

    if (!raw) return null;
    return {
        config: JSON.parse(raw) as ChallengeConfig,
        remainingSeconds: ttl,
    };
}

export async function submitSolution(
    sessionId: string,
    code: string,
    language: string,
): Promise<SubmissionResult | null> {
    const challenge = await getChallenge(sessionId);
    if (!challenge) {
        // Session expired → time violation
        return {
            submittedAt: new Date().toISOString(),
            language,
            code: '',
            status: 'TIMEOUT',
            timeElapsedSeconds: -1,
        };
    }

    const startedAt = new Date(challenge.config.startedAt).getTime();
    const timeElapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);

    const result: SubmissionResult = {
        submittedAt: new Date().toISOString(),
        language,
        code,
        status: 'SUBMITTED',
        timeElapsedSeconds,
    };

    // Store submission alongside the challenge config
    const submissionKey = `${CODING_SESSION_PREFIX}${sessionId}:submission`;
    await redis.setex(submissionKey, 86400, JSON.stringify(result)); // keep for 24h

    // Remove active challenge key so session cannot be re-submitted
    await redis.del(`${CODING_SESSION_PREFIX}${sessionId}`);

    return result;
}

export async function getSubmission(sessionId: string): Promise<SubmissionResult | null> {
    const key = `${CODING_SESSION_PREFIX}${sessionId}:submission`;
    const raw = await redis.get(key);
    return raw ? JSON.parse(raw) : null;
}
