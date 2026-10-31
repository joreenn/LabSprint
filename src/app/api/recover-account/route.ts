import { z, ZodError } from 'zod';
import { getTrustedOrigins } from '@/lib/auth';
import { HttpError, parseBody } from '@/lib/server/http';
import {
  limitRecovery,
  recoverAccount,
  recoveryCodeError,
  recoveryRequestKeys,
} from '@/lib/recovery-codes';

export const dynamic = 'force-dynamic';
const input = z
  .object({
    email: z.email().max(254),
    code: z
      .string()
      .min(1)
      .max(100)
      .refine(
        (value) => /^[a-fA-F0-9]{32}$/.test(value.replace(/[\s-]/g, '')),
        'Enter a complete recovery code.',
      ),
    newPassword: z.string().min(12, 'Use at least 12 characters for your new password.').max(128),
  })
  .strict();

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin');
    if (
      (origin && !getTrustedOrigins().includes(origin)) ||
      request.headers.get('sec-fetch-site') === 'cross-site'
    ) {
      throw new HttpError(403, 'This request must come from LabSprint.');
    }
    const body = await parseBody(request, input);
    await limitRecovery(recoveryRequestKeys(request, body.email));
    if (!(await recoverAccount(body.email, body.code, body.newPassword)))
      throw new HttpError(400, recoveryCodeError);
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof HttpError)
      return Response.json(
        { error: error.message },
        { status: error.status, headers: { 'Cache-Control': 'no-store' } },
      );
    if (error instanceof ZodError)
      return Response.json(
        { error: error.issues[0]?.message || 'Check your recovery details.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    // Never log request bodies, reset codes, or passwords.
    console.error('Account recovery could not complete.');
    return Response.json(
      { error: 'Account recovery could not complete. Please try again.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
