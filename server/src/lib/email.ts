import nodemailer from 'nodemailer';
import { config } from '../config/env';

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

export async function sendInterviewScheduledEmail(opts: {
    candidateEmail: string;
    candidateName: string;
    interviewerEmail: string;
    interviewerName: string;
    jobTitle: string;
    scheduledAt: Date;
    timezone: string;
    meetingUrl?: string;
}) {
    const formattedTime = opts.scheduledAt.toLocaleString('en-IN', {
        timeZone: opts.timezone,
        dateStyle: 'full',
        timeStyle: 'short',
    });

    const subject = `Interview Scheduled – ${opts.jobTitle} | HireFlow`;

    const htmlBody = (name: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6c3ce1, #3b82f6); padding: 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900;">HireFlow</h1>
        <p style="margin: 8px 0 0; opacity: 0.8;">Technical Interview-as-a-Service</p>
      </div>
      <div style="padding: 32px;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your interview for <strong>${opts.jobTitle}</strong> has been scheduled.</p>
        <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #aaa;">Scheduled Time</p>
          <p style="margin: 4px 0 0; font-size: 18px; font-weight: bold;">${formattedTime} (${opts.timezone})</p>
        </div>
        ${opts.meetingUrl ? `<a href="${opts.meetingUrl}" style="display: inline-block; background: #6c3ce1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Join Interview Room</a>` : ''}
        <p style="color: #aaa; font-size: 12px; margin-top: 32px;">This is an automated message from HireFlow. Please do not reply.</p>
      </div>
    </div>`;

    if (!config.email.user) {
        // Dev mode: log instead of send
        console.log(`[EMAIL] Would send to ${opts.candidateEmail} & ${opts.interviewerEmail}: ${subject}`);
        return;
    }

    await Promise.all([
        transporter.sendMail({
            from: config.email.from,
            to: opts.candidateEmail,
            subject,
            html: htmlBody(opts.candidateName),
        }),
        transporter.sendMail({
            from: config.email.from,
            to: opts.interviewerEmail,
            subject,
            html: htmlBody(opts.interviewerName),
        }),
    ]);
}

export async function sendScorecardEmail(opts: {
    hrEmail: string;
    candidateName: string;
    jobTitle: string;
    recommendation: string;
    overallScore: number;
}) {
    const subject = `Scorecard Ready – ${opts.candidateName} | HireFlow`;
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Interview Evaluation Complete</h2>
      <p>The scorecard for <strong>${opts.candidateName}</strong> applying for <strong>${opts.jobTitle}</strong> is now available.</p>
      <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p><strong>Overall Score:</strong> ${opts.overallScore}/10</p>
        <p><strong>Recommendation:</strong> ${opts.recommendation.replace('_', ' ')}</p>
      </div>
      <p>Login to your HireFlow dashboard to view the full report.</p>
    </div>`;

    if (!config.email.user) {
        console.log(`[EMAIL] Would send scorecard to ${opts.hrEmail}: ${subject}`);
        return;
    }

    await transporter.sendMail({ from: config.email.from, to: opts.hrEmail, subject, html });
}
