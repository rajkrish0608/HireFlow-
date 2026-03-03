import { db } from '../../config/db';
import { scorecards, interviewSessions, candidates, interviewers } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Hire Success Prediction Engine
 *
 * Produces a predictive score (0–100) estimating the likelihood that
 * a candidate will be a successful hire, based on available interview data.
 *
 * This is a rule-based scoring model that can be replaced with an
 * XGBoost or TensorFlow model served via a Python microservice.
 *
 * Factors:
 *  - Rubric scores (weighted 40%)
 *  - Interviewer confidence / recommendation (weighted 25%)
 *  - Skill alignment with job role (weighted 20%)
 *  - Experience years vs seniority match (weighted 15%)
 */

interface PredictionInput {
    sessionId: string;
}

interface PredictionResult {
    score: number;           // 0–100
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    factors: {
        rubricScore: number;
        recommendationScore: number;
        skillAlignmentScore: number;
        experienceScore: number;
    };
    recommendation: string;
    explanation: string;
}

const RECOMMENDATION_WEIGHTS: Record<string, number> = {
    STRONG_HIRE: 100,
    HIRE: 70,
    NO_HIRE: 15,
};

export async function predictHireSuccess(input: PredictionInput): Promise<PredictionResult | null> {
    // 1. Fetch scorecard + session data
    const [card] = await db
        .select({ scorecard: scorecards, session: interviewSessions })
        .from(scorecards)
        .innerJoin(interviewSessions, eq(interviewSessions.id, scorecards.sessionId))
        .where(eq(scorecards.sessionId, input.sessionId));

    if (!card) return null;

    const rubric = card.scorecard.rubricScores as Record<string, number>;
    const recommendation = card.scorecard.recommendation;

    // 2. Fetch candidate + interviewer
    const [candidate] = await db.select().from(candidates).where(eq(candidates.id, card.session.candidateId));
    const [interviewer] = await db.select().from(interviewers).where(eq(interviewers.id, card.session.interviewerId));

    // ─── Factor 1: Rubric Score (40%) ─────────────────────────
    const rubricValues = Object.values(rubric);
    const avgRubric = rubricValues.length > 0
        ? rubricValues.reduce((a, b) => a + b, 0) / rubricValues.length
        : 5;
    const rubricScore = (avgRubric / 10) * 100; // normalize to 0–100

    // ─── Factor 2: Recommendation (25%) ───────────────────────
    const recommendationScore = RECOMMENDATION_WEIGHTS[recommendation] || 50;

    // ─── Factor 3: Skill Alignment (20%) ──────────────────────
    let skillAlignmentScore = 50; // default
    if (candidate && interviewer) {
        const candidateSkills = candidate.skills.map((s) => s.toLowerCase());
        const interviewerSkills = interviewer.skills.map((s) => s.toLowerCase());
        const overlap = candidateSkills.filter((s) => interviewerSkills.includes(s));
        skillAlignmentScore = candidateSkills.length > 0
            ? (overlap.length / candidateSkills.length) * 100
            : 50;
    }

    // ─── Factor 4: Experience (15%) ───────────────────────────
    let experienceScore = 50;
    if (candidate) {
        // Scale: 0–2 years = 30, 3–5 = 60, 6–10 = 85, 10+ = 100
        const yrs = candidate.experienceYears;
        if (yrs <= 2) experienceScore = 30;
        else if (yrs <= 5) experienceScore = 60;
        else if (yrs <= 10) experienceScore = 85;
        else experienceScore = 100;
    }

    // ─── Weighted composite ────────────────────────────────────
    const score = Math.round(
        rubricScore * 0.40 +
        recommendationScore * 0.25 +
        skillAlignmentScore * 0.20 +
        experienceScore * 0.15
    );

    // Confidence based on data completeness
    const dataPoints = [rubricValues.length > 0, !!candidate, !!interviewer, !!recommendation];
    const completeness = dataPoints.filter(Boolean).length / dataPoints.length;
    const confidence = completeness >= 0.75 ? 'HIGH' : completeness >= 0.5 ? 'MEDIUM' : 'LOW';

    // Textual recommendation
    let explanationText: string;
    if (score >= 80) {
        explanationText = 'Strong candidate with excellent interview performance. Highly recommended for hire.';
    } else if (score >= 60) {
        explanationText = 'Good candidate overall. Minor gaps — consider a follow-up if unsure.';
    } else if (score >= 40) {
        explanationText = 'Average performance. May be suitable for a different role or seniority level.';
    } else {
        explanationText = 'Below expectations. Not recommended for this role at this time.';
    }

    return {
        score,
        confidence,
        factors: {
            rubricScore: Math.round(rubricScore),
            recommendationScore,
            skillAlignmentScore: Math.round(skillAlignmentScore),
            experienceScore,
        },
        recommendation: score >= 60 ? 'PROCEED_TO_OFFER' : score >= 40 ? 'FURTHER_REVIEW' : 'PASS',
        explanation: explanationText,
    };
}
