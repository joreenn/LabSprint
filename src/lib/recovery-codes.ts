import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { and, asc, eq, inArray, isNull, like, lt, sql } from 'drizzle-orm';
import { getDb } from '@/db';
import * as tables from '@/db/schema';
import { getAuth } from './auth';
import { HttpError } from './server/http';

const invalidRecovery =
  'That email and recovery code could not be verified. Check them or use another unused code.';
const normalizedCode = (code: string) => code.replace(/[\s-]/g, '').toUpperCase();
const hashCode = (code: string) =>
  createHash('sha256')
    .update(`labsprint-recovery-v1:${normalizedCode(code)}`)
    .digest('hex');
export const recoveryCodeError = invalidRecovery;

/** Atomic database rate limits also work across separate Vercel instances. */
export async function limitRecovery(keys: { key: string; max: number; seconds: number }[]) {
  const db = await getDb();
  let limited = false;
  const now = new Date();
  await db.transaction(async (tx) => {
    for (const item of keys) {
      const cutoff = new Date(now.getTime() - item.seconds * 1000);
      const [row] = await tx
        .insert(tables.recoveryRateLimit)
        .values({ key: item.key, count: 1, windowStart: now })
        .onConflictDoUpdate({
          target: tables.recoveryRateLimit.key,
          set: {
            count: sql`CASE WHEN ${tables.recoveryRateLimit.windowStart} < ${cutoff} THEN 1 ELSE LEAST(${tables.recoveryRateLimit.count}, ${item.max}) + 1 END`,
            windowStart: sql`CASE WHEN ${tables.recoveryRateLimit.windowStart} < ${cutoff} THEN ${now} ELSE ${tables.recoveryRateLimit.windowStart} END`,
          },
        })
        .returning({ count: tables.recoveryRateLimit.count });
      if (row.count > item.max) {
        limited = true;
        // Commit this bucket's accounting, but do not touch later email/user buckets.
        break;
      }
    }
    if (!limited) {
      // Every configured window is 15 minutes. Retain a day, then prune a bounded
      // indexed batch on admitted requests; expired selectors must not grow forever.
      const expiredBefore = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const expired = tx
        .select({ key: tables.recoveryRateLimit.key })
        .from(tables.recoveryRateLimit)
        .where(lt(tables.recoveryRateLimit.windowStart, expiredBefore))
        .orderBy(asc(tables.recoveryRateLimit.windowStart))
        .limit(100);
      await tx
        .delete(tables.recoveryRateLimit)
        .where(
          and(
            lt(tables.recoveryRateLimit.windowStart, expiredBefore),
            inArray(tables.recoveryRateLimit.key, expired),
          ),
        );
    }
  });
  if (limited)
    throw new HttpError(
      429,
      'Too many recovery attempts. Please wait 15 minutes before trying again.',
    );
}

export function recoveryRequestKeys(request: Request, email: string) {
  // Vercel overwrites x-real-ip at its trusted ingress. The local server is loopback-only.
  const ip = request.headers.get('x-real-ip')?.slice(0, 100) || 'local';
  return [
    {
      key: `recover-ip:${createHash('sha256').update(ip).digest('hex')}`,
      max: 10,
      seconds: 15 * 60,
    },
    {
      key: `recover-email:${createHash('sha256').update(email.toLowerCase()).digest('hex')}`,
      max: 5,
      seconds: 15 * 60,
    },
  ];
}

export async function recoveryStatus(userId: string) {
  const db = await getDb();
  const rows = await db
    .select({ usedAt: tables.recoveryCode.usedAt })
    .from(tables.recoveryCode)
    .where(eq(tables.recoveryCode.userId, userId));
  return { remaining: rows.filter((row) => row.usedAt === null).length, total: rows.length };
}

export async function generateRecoveryCodes(userId: string, password: string) {
  const db = await getDb();
  const auth = await getAuth();
  const context = await auth.$context;
  const codes = Array.from({ length: 10 }, () =>
    randomBytes(16).toString('hex').toUpperCase().match(/.{4}/g)!.join('-'),
  );
  await db.transaction(async (tx) => {
    const [owner] = await tx
      .select({ id: tables.user.id })
      .from(tables.user)
      .where(eq(tables.user.id, userId))
      .for('update');
    if (!owner) throw new HttpError(401, 'Please sign in again.');
    const [account] = await tx
      .select({ password: tables.account.password })
      .from(tables.account)
      .where(and(eq(tables.account.userId, userId), eq(tables.account.providerId, 'credential')));
    if (
      !account?.password ||
      !(await context.password.verify({ hash: account.password, password }))
    ) {
      throw new HttpError(400, 'Your current password is incorrect.');
    }
    await tx.delete(tables.recoveryCode).where(eq(tables.recoveryCode.userId, userId));
    await tx
      .insert(tables.recoveryCode)
      .values(codes.map((code) => ({ id: randomUUID(), userId, codeHash: hashCode(code) })));
  });
  return codes;
}

/** Uses Better Auth's configured password hashing; all credential changes commit atomically. */
export async function recoverAccount(email: string, code: string, newPassword: string) {
  const auth = await getAuth();
  const context = await auth.$context;
  if (
    newPassword.length < context.password.config.minPasswordLength ||
    newPassword.length > context.password.config.maxPasswordLength
  ) {
    throw new HttpError(400, 'Choose a password between 12 and 128 characters.');
  }
  // Hash for both existent and non-existent accounts to avoid a cheap account-existence signal.
  const passwordHash = await context.password.hash(newPassword);
  const codeHash = hashCode(code);
  const db = await getDb();
  return db.transaction(async (tx) => {
    const [owner] = await tx
      .select({ id: tables.user.id })
      .from(tables.user)
      .where(eq(tables.user.email, email.trim().toLowerCase()))
      .for('update');
    if (!owner) return false;
    const [saved] = await tx
      .select({ id: tables.recoveryCode.id })
      .from(tables.recoveryCode)
      .where(
        and(
          eq(tables.recoveryCode.userId, owner.id),
          eq(tables.recoveryCode.codeHash, codeHash),
          isNull(tables.recoveryCode.usedAt),
        ),
      );
    if (!saved) return false;
    const [credential] = await tx
      .select({ id: tables.account.id })
      .from(tables.account)
      .where(and(eq(tables.account.userId, owner.id), eq(tables.account.providerId, 'credential')));
    if (!credential) return false;
    const now = new Date();
    await tx
      .update(tables.recoveryCode)
      .set({ usedAt: now })
      .where(and(eq(tables.recoveryCode.id, saved.id), isNull(tables.recoveryCode.usedAt)));
    // This app exclusively uses authoritative database sessions (no cookie or secondary-storage cache).
    await tx.delete(tables.session).where(eq(tables.session.userId, owner.id));
    await tx
      .update(tables.account)
      .set({ password: passwordHash, updatedAt: now })
      .where(eq(tables.account.id, credential.id));
    await tx
      .delete(tables.verification)
      .where(
        and(
          eq(tables.verification.value, owner.id),
          like(tables.verification.identifier, 'reset-password:%'),
        ),
      );
    return true;
  });
}
