import { randomBytes } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { nextCookies } from 'better-auth/next-js';
import { getDb } from '../db';
import * as schema from '../db/schema';
import { isRecoveryConfigured, sendRecoveryEmail } from './mail';

export function getTrustedOrigins(): string[] {
  const configured = process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL && (!configured || !configured.startsWith('https://'))) {
    throw new Error('BETTER_AUTH_URL must be an HTTPS deployment origin on Vercel.');
  }
  const canonical = new URL(configured || 'http://127.0.0.1:3000').origin;
  return process.env.VERCEL
    ? [canonical]
    : [...new Set([canonical, 'http://localhost:3000', 'http://127.0.0.1:3000'])];
}

function secret(): string {
  const configured = process.env.BETTER_AUTH_SECRET;
  if (configured) {
    if (configured.length < 32)
      throw new Error('BETTER_AUTH_SECRET must contain at least 32 characters.');
    return configured;
  }
  if (process.env.VERCEL) throw new Error('BETTER_AUTH_SECRET is required on Vercel.');
  const directory = resolve(process.env.LABSPRINT_DATA_DIR || '.data');
  mkdirSync(directory, { recursive: true });
  const path = resolve(directory, 'auth-secret');
  try {
    writeFileSync(path, randomBytes(48).toString('base64url'), { flag: 'wx', mode: 0o600 });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
  }
  return readFileSync(path, 'utf8').trim();
}

async function createAuth() {
  const baseURL = process.env.BETTER_AUTH_URL || 'http://127.0.0.1:3000';
  if (process.env.VERCEL && (!process.env.BETTER_AUTH_URL || !baseURL.startsWith('https://'))) {
    throw new Error('BETTER_AUTH_URL must be an HTTPS deployment origin on Vercel.');
  }
  return betterAuth({
    appName: 'LabSprint',
    baseURL,
    secret: secret(),
    database: drizzleAdapter(await getDb(), { provider: 'pg', schema, transaction: true }),
    trustedOrigins: getTrustedOrigins(),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      autoSignIn: true,
      resetPasswordTokenExpiresIn: 30 * 60,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: isRecoveryConfigured() ? sendRecoveryEmail : undefined,
    },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    rateLimit: {
      enabled: true,
      storage: 'database',
      window: 60,
      max: 100,
      customRules: {
        '/sign-in/email': { window: 60, max: 10 },
        '/sign-up/email': { window: 60, max: 5 },
        '/request-password-reset': { window: 300, max: 3 },
        '/reset-password': { window: 60, max: 5 },
      },
    },
    advanced: { cookiePrefix: 'labsprint', ipAddress: { ipAddressHeaders: ['x-real-ip'] } },
    plugins: [nextCookies()],
  });
}
const authState = globalThis as typeof globalThis & {
  labsprintAuth?: ReturnType<typeof createAuth>;
};
export function getAuth() {
  authState.labsprintAuth ??= createAuth().catch((error) => {
    delete authState.labsprintAuth;
    throw error;
  });
  return authState.labsprintAuth;
}
