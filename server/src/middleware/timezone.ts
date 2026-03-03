import type { Request, Response, NextFunction } from 'express';

/**
 * Multi-Timezone Middleware
 *
 * Reads the client's timezone from the `X-Timezone` header
 * and attaches it to the request for downstream handlers.
 *
 * Usage:
 *   - Client sends: X-Timezone: Asia/Kolkata
 *   - Server stores all dates in UTC
 *   - Response middleware converts timestamps to the client's timezone
 */

export function timezoneParser(req: Request, _res: Response, next: NextFunction) {
    const tz = req.headers['x-timezone'] as string || 'UTC';
    (req as any).clientTimezone = tz;
    next();
}

/**
 * Converts a UTC Date to a localized ISO string for the given IANA timezone.
 * Falls back to UTC if the timezone is invalid.
 */
export function toClientTimezone(date: Date | string | null, timezone: string): string | null {
    if (!date) return null;
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleString('en-US', {
            timeZone: timezone,
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false,
        });
    } catch {
        // Invalid timezone → return UTC ISO string
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toISOString();
    }
}

/**
 * Returns commonly used timezone options for the frontend dropdown.
 */
export function getTimezoneOptions(): { value: string; label: string; offset: string }[] {
    return [
        { value: 'America/New_York', label: 'Eastern Time (US)', offset: 'UTC-5' },
        { value: 'America/Chicago', label: 'Central Time (US)', offset: 'UTC-6' },
        { value: 'America/Denver', label: 'Mountain Time (US)', offset: 'UTC-7' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (US)', offset: 'UTC-8' },
        { value: 'Europe/London', label: 'London (GMT)', offset: 'UTC+0' },
        { value: 'Europe/Paris', label: 'Central European Time', offset: 'UTC+1' },
        { value: 'Europe/Berlin', label: 'Berlin (CET)', offset: 'UTC+1' },
        { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: 'UTC+4' },
        { value: 'Asia/Kolkata', label: 'India Standard Time', offset: 'UTC+5:30' },
        { value: 'Asia/Singapore', label: 'Singapore Time', offset: 'UTC+8' },
        { value: 'Asia/Tokyo', label: 'Japan Standard Time', offset: 'UTC+9' },
        { value: 'Australia/Sydney', label: 'Sydney (AEST)', offset: 'UTC+10' },
        { value: 'Pacific/Auckland', label: 'New Zealand (NZST)', offset: 'UTC+12' },
        { value: 'UTC', label: 'UTC (Coordinated)', offset: 'UTC+0' },
    ];
}
