import Redis from 'ioredis';
import { config } from './env';

export const redis = new Redis(config.redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        if (times > 5) return null;
        return Math.min(times * 100, 3000);
    },
});

redis.on('connect', () => console.log('[Redis] Connected'));
redis.on('error', (err) => console.error('[Redis] Error:', err.message));
