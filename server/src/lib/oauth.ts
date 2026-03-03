import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { db } from '../config/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

// ─── Types ────────────────────────────────────────────────────────────────────
interface OAuthProfile {
    id: string;
    displayName: string;
    emails?: Array<{ value: string }>;
    provider: string;
}

// ─── Helper: find or create user from OAuth profile ──────────────────────────
async function findOrCreateOAuthUser(profile: OAuthProfile) {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new Error('Email not provided by OAuth provider');

    // Check if user exists
    const [existing] = await db.select().from(users).where(eq(users.email, email));

    if (existing) {
        return existing;
    }

    // Create new user with a random password hash (OAuth users don't use passwords)
    const [newUser] = await db.insert(users).values({
        email,
        passwordHash: `oauth_${profile.provider}_${profile.id}`, // marker, not a real hash
        role: 'HR', // default role for OAuth users
        isActive: true,
    }).returning();

    return newUser;
}

// ─── Generate JWT for OAuth user ──────────────────────────────────────────────
function generateToken(user: { id: string; email: string; role: string }): string {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
    );
}

// ─── GitHub Strategy ──────────────────────────────────────────────────────────
export function configureGitHub() {
    const clientID = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const callbackURL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:4000/api/auth/github/callback';

    if (!clientID || !clientSecret) {
        console.warn('[OAuth] ⚠️  GitHub OAuth not configured (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET missing)');
        return;
    }

    passport.use(new GitHubStrategy(
        { clientID, clientSecret, callbackURL, scope: ['user:email'] },
        async (_accessToken: string, _refreshToken: string, profile: OAuthProfile, done: Function) => {
            try {
                const user = await findOrCreateOAuthUser(profile);
                const token = generateToken(user);
                done(null, { user, token });
            } catch (err) {
                done(err, null);
            }
        }
    ));

    console.log('[OAuth] ✅ GitHub strategy configured');
}

// ─── LinkedIn Strategy ────────────────────────────────────────────────────────
export function configureLinkedIn() {
    const clientID = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const callbackURL = process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:4000/api/auth/linkedin/callback';

    if (!clientID || !clientSecret) {
        console.warn('[OAuth] ⚠️  LinkedIn OAuth not configured (LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET missing)');
        return;
    }

    passport.use(new LinkedInStrategy(
        { clientID, clientSecret, callbackURL, scope: ['openid', 'profile', 'email'] },
        async (_accessToken: string, _refreshToken: string, profile: OAuthProfile, done: Function) => {
            try {
                const user = await findOrCreateOAuthUser(profile);
                const token = generateToken(user);
                done(null, { user, token });
            } catch (err) {
                done(err, null);
            }
        }
    ));

    console.log('[OAuth] ✅ LinkedIn strategy configured');
}

// ─── Initialize all strategies ────────────────────────────────────────────────
export function initializePassport() {
    passport.serializeUser((user: any, done: Function) => done(null, user));
    passport.deserializeUser((user: any, done: Function) => done(null, user));

    configureGitHub();
    configureLinkedIn();

    return passport.initialize();
}
