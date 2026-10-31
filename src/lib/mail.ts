import { createHash } from 'node:crypto';

type RecoveryMail = { user: { name: string; email: string }; url: string; token: string };

export function isRecoveryConfigured(): boolean {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.MAIL_FROM?.trim();
  return Boolean(
    key && from && !/[\r\n]/.test(from) && /[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+/.test(from),
  );
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character]!,
  );
}

/** Sends only the library-generated, same-origin recovery link. Never log tokens or addresses. */
export async function sendRecoveryEmail({ user, url, token }: RecoveryMail): Promise<void> {
  if (!isRecoveryConfigured()) throw new Error('Email recovery is not configured.');
  const canonical = new URL(process.env.BETTER_AUTH_URL || 'http://127.0.0.1:3000').origin;
  const resetUrl = new URL(url);
  if (resetUrl.origin !== canonical || !resetUrl.pathname.startsWith('/api/auth/reset-password/')) {
    throw new Error('Invalid recovery destination.');
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `labsprint-reset-${createHash('sha256').update(token).digest('hex')}`,
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM!.trim(),
      to: [user.email],
      subject: 'Reset your LabSprint password',
      text: `Hi ${user.name || 'there'},\n\nUse this link to reset your LabSprint password:\n${url}\n\nThe link expires in 30 minutes and can be used once. Your account and study progress stay the same.\n\nIf you did not request this, ignore this email.\n\nLabSprint`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.7;max-width:520px;margin:auto;color:#292639"><h1 style="font-size:25px;color:#6251c6">Back to your study space.</h1><p>Hi ${escapeHtml(user.name || 'there')},</p><p>Use the button below to choose a new LabSprint password. Your account and study progress stay the same.</p><p style="margin:28px 0"><a href="${escapeHtml(url)}" style="display:inline-block;background:#6251c6;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none">Reset my password</a></p><p>This link expires in 30 minutes and can be used once.</p><p style="color:#777">If you did not request this, ignore this email. Your password will stay unchanged.</p><p>LabSprint</p></div>`,
    }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    // Provider response bodies may contain recipient details. Keep diagnostics non-sensitive.
    throw new Error(`Recovery email delivery failed (${response.status}).`);
  }
}
