import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

test('one-time recovery codes preserve progress, reject reuse and serialize concurrent resets', async () => {
  const directory = resolve('.data', `recovery-test-${randomUUID()}`);
  process.env.LABSPRINT_DATA_DIR = directory;
  process.env.BETTER_AUTH_URL = 'http://127.0.0.1:3000';
  process.env.RESEND_API_KEY = 're_test-only';
  process.env.MAIL_FROM = 'LabSprint <recovery@example.test>';
  const originalFetch = globalThis.fetch;
  const mails: { to: string[]; text: string; html: string }[] = [];
  let mailUnavailable = false;
  globalThis.fetch = async (input, init) => {
    if (String(input) !== 'https://api.resend.com/emails')
      throw new Error('Unexpected test network call');
    if (mailUnavailable) throw new Error('Synthetic mail outage');
    mails.push(JSON.parse(String(init?.body)));
    return new Response(JSON.stringify({ id: 'test-mail' }), { status: 200 });
  };
  const { getAuth } = await import('../src/lib/auth');
  const { getDb, closeDb } = await import('../src/db');
  const tables = await import('../src/db/schema');
  const { eq } = await import('drizzle-orm');
  const recovery = await import('../src/lib/recovery-codes');
  const workspace = await import('../src/lib/server/workspace');
  const { questions } = await import('../src/content/questions');
  const { POST: generateRoute, GET: codeStatus } =
    await import('../src/app/api/recovery-codes/route');
  const { POST: recoverRoute } = await import('../src/app/api/recover-account/route');
  try {
    const auth = await getAuth();
    const db = await getDb();
    const origin = 'http://127.0.0.1:3000';
    const password = 'Test-only-password-2026';
    const authRequest = (path: string, body: unknown, cookie?: string, ip = '127.0.0.5') =>
      auth.handler(
        new Request(`${origin}/api/auth/${path}`, {
          method: 'POST',
          headers: {
            origin,
            'Content-Type': 'application/json',
            'x-real-ip': ip,
            ...(cookie ? { cookie } : {}),
          },
          body: JSON.stringify(body),
        }),
      );
    const signup = await authRequest('sign-up/email', {
      name: 'Recovery Test',
      email: 'recover@example.test',
      password,
    });
    assert.equal(signup.status, 200);
    const { user } = await signup.json();
    const cookie = signup.headers
      .getSetCookie()
      .map((value) => value.split(';')[0])
      .join('; ');
    const other = await authRequest('sign-up/email', {
      name: 'Another User',
      email: 'another@example.test',
      password,
    });
    const otherUser = (await other.json()).user;
    const question = questions[0];
    const sessionId = randomUUID();
    await workspace.savePractice(user.id, {
      id: sessionId,
      questionIds: [question.id],
      index: 0,
      answers: {},
      replaceSessionId: null,
    });
    await workspace.recordAttempt(user.id, {
      id: randomUUID(),
      sessionId,
      questionId: question.id,
      optionId: question.correctOptionId,
    });
    await workspace.setBookmark(user.id, question.id, true);
    const generateRequest = (currentPassword: string, sessionCookie = cookie) =>
      generateRoute(
        new Request(`${origin}/api/recovery-codes`, {
          method: 'POST',
          headers: { origin, cookie: sessionCookie, 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: currentPassword }),
        }),
      );
    assert.equal((await generateRequest('incorrect-password')).status, 400);
    const generated = await generateRequest(password);
    assert.equal(generated.status, 200);
    const { codes } = await generated.json();
    assert.equal(codes.length, 10);
    assert.equal(new Set(codes).size, 10);
    assert.ok(codes.every((code: string) => /^[0-9A-F]{4}(?:-[0-9A-F]{4}){7}$/.test(code)));
    const stored = await db
      .select()
      .from(tables.recoveryCode)
      .where(eq(tables.recoveryCode.userId, user.id));
    assert.ok(stored.every((row) => row.codeHash.length === 64 && !codes.includes(row.codeHash)));
    assert.deepEqual(await recovery.recoveryStatus(user.id), { total: 10, remaining: 10 });
    assert.deepEqual(await recovery.recoveryStatus(otherUser.id), { total: 0, remaining: 0 });
    const replacements = await recovery.generateRecoveryCodes(user.id, password);
    assert.equal(
      await recovery.recoverAccount('recover@example.test', codes[0], 'Replacement-password-2026'),
      false,
      'Rotating codes invalidates old ones.',
    );
    await assert.rejects(
      () => recovery.recoverAccount('recover@example.test', replacements[0], 'too-short'),
      /12 and 128/,
    );
    assert.equal(
      (await recovery.recoveryStatus(user.id)).remaining,
      10,
      'Invalid new password must not consume a code.',
    );
    const freshPassword = 'Recovered-password-2026';
    const outcomes = await Promise.all([
      recovery.recoverAccount('recover@example.test', replacements[0], freshPassword),
      recovery.recoverAccount('recover@example.test', replacements[0], freshPassword),
    ]);
    assert.equal(
      outcomes.filter(Boolean).length,
      1,
      'Exactly one concurrent reset can spend a code.',
    );
    assert.equal(
      await recovery.recoverAccount(
        'recover@example.test',
        replacements[0],
        'Another-password-2026',
      ),
      false,
    );
    assert.equal((await recovery.recoveryStatus(user.id)).remaining, 9);
    const sessions = await db
      .select()
      .from(tables.session)
      .where(eq(tables.session.userId, user.id));
    assert.equal(sessions.length, 0, 'Account recovery revokes every old session.');
    const invalidated = await codeStatus(
      new Request(`${origin}/api/recovery-codes`, { headers: { cookie } }),
    );
    assert.equal(invalidated.status, 401);
    const oldLogin = await authRequest('sign-in/email', {
      email: 'recover@example.test',
      password,
    });
    assert.equal(oldLogin.status, 401);
    const newLogin = await authRequest('sign-in/email', {
      email: 'recover@example.test',
      password: freshPassword,
    });
    assert.equal(newLogin.status, 200);
    assert.equal((await newLogin.json()).user.id, user.id);
    const progress = await workspace.getWorkspace(user);
    assert.equal(progress.attempts.length, 1);
    assert.deepEqual(progress.bookmarks, [question.id]);
    assert.equal(progress.activeSession?.id, sessionId);
    const requestRecovery = (email: string, requestOrigin = origin) =>
      recoverRoute(
        new Request(`${origin}/api/recover-account`, {
          method: 'POST',
          headers: {
            origin: requestOrigin,
            'Content-Type': 'application/json',
            'x-real-ip': '127.0.0.6',
          },
          body: JSON.stringify({
            email,
            code: '00000000-0000-0000-0000-000000000000',
            newPassword: 'Unchanged-password-2026',
          }),
        }),
      );
    assert.equal(
      (await requestRecovery('recover@example.test', 'https://hostile.test')).status,
      403,
    );
    const missing = await requestRecovery('missing@example.test');
    const incorrect = await requestRecovery('recover@example.test');
    assert.equal(missing.status, 400);
    assert.equal(incorrect.status, 400);
    assert.equal(
      (await missing.json()).error,
      (await incorrect.json()).error,
      'Unknown email and wrong code have the same public error.',
    );
    for (let index = 0; index < 4; index++)
      assert.equal((await requestRecovery('recover@example.test')).status, 400);
    assert.equal(
      (await requestRecovery('recover@example.test')).status,
      429,
      'Per-email limit is shared in the database.',
    );

    const unknownEmail = await authRequest('request-password-reset', {
      email: 'unknown@example.test',
      redirectTo: `${origin}/reset-password`,
    });
    assert.equal(unknownEmail.status, 200);
    assert.equal(mails.length, 0);
    const resetRequest = await authRequest('request-password-reset', {
      email: 'recover@example.test',
      redirectTo: `${origin}/reset-password`,
    });
    assert.equal(resetRequest.status, 200);
    assert.deepEqual(
      await resetRequest.json(),
      await unknownEmail.json(),
      'Email requests do not reveal registration.',
    );
    assert.equal(mails.length, 1);
    assert.ok(mails[0].text.includes('30 minutes'));
    const match = mails[0].text.match(
      /http:\/\/127\.0\.0\.1:3000\/api\/auth\/reset-password\/([^?\s]+)/,
    );
    assert.ok(match, 'Email uses the library-generated same-origin reset callback.');
    const token = match[1];
    const emailPassword = 'Email-reset-password-2026';
    const reset = await authRequest('reset-password', { token, newPassword: emailPassword });
    assert.equal(reset.status, 200);
    assert.equal(
      (await authRequest('reset-password', { token, newPassword: 'Another-password-2026' })).status,
      400,
      'Email token is one-use.',
    );
    const afterEmailReset = await workspace.getWorkspace(user);
    assert.equal(afterEmailReset.attempts.length, 1);
    assert.deepEqual(afterEmailReset.bookmarks, [question.id]);
    assert.equal(
      (await recovery.recoveryStatus(user.id)).remaining,
      9,
      'Email reset preserves unused recovery codes.',
    );
    const newSessionCookie = newLogin.headers
      .getSetCookie()
      .map((value) => value.split(';')[0])
      .join('; ');
    assert.equal(
      (
        await codeStatus(
          new Request(`${origin}/api/recovery-codes`, { headers: { cookie: newSessionCookie } }),
        )
      ).status,
      401,
      'Email reset revokes existing sessions.',
    );
    const afterEmailLogin = await authRequest('sign-in/email', {
      email: 'recover@example.test',
      password: emailPassword,
    });
    assert.equal(afterEmailLogin.status, 200);
    assert.equal(
      (await afterEmailLogin.json()).user.id,
      user.id,
      'Email reset keeps the original account.',
    );

    const expiredRequest = await authRequest(
      'request-password-reset',
      {
        email: 'recover@example.test',
        redirectTo: `${origin}/reset-password`,
      },
      undefined,
      '127.0.0.7',
    );
    assert.equal(expiredRequest.status, 200);
    const expiredToken = mails.at(-1)!.text.match(/\/api\/auth\/reset-password\/([^?\s]+)/)![1];
    await db
      .update(tables.verification)
      .set({ expiresAt: new Date(Date.now() - 60_000) })
      .where(eq(tables.verification.identifier, `reset-password:${expiredToken}`));
    const expiredCallback = await auth.handler(
      new Request(
        `${origin}/api/auth/reset-password/${expiredToken}?callbackURL=${encodeURIComponent(`${origin}/reset-password`)}`,
      ),
    );
    assert.equal(expiredCallback.status, 302);
    assert.equal(
      new URL(expiredCallback.headers.get('location')!).searchParams.get('error'),
      'INVALID_TOKEN',
    );
    assert.equal(
      (
        await authRequest('reset-password', {
          token: expiredToken,
          newPassword: 'Another-password-2026',
        })
      ).status,
      400,
      'Expired tokens cannot reset credentials.',
    );

    mailUnavailable = true;
    const originalError = console.error;
    const deliveryDiagnostics: unknown[][] = [];
    console.error = (...args: unknown[]) => {
      deliveryDiagnostics.push(args);
    };
    try {
      const unavailable = await authRequest('request-password-reset', {
        email: 'recover@example.test',
        redirectTo: `${origin}/reset-password`,
      });
      assert.equal(unavailable.status, 200, 'A mail outage must not disclose an existing account.');
      assert.deepEqual(await unavailable.json(), {
        status: true,
        message: 'If this email exists in our system, check your email for the reset link',
      });
      assert.deepEqual(
        deliveryDiagnostics,
        [['Password-reset email dispatch failed. Check mail service configuration.']],
        'Only a fixed operational diagnostic is logged.',
      );
    } finally {
      console.error = originalError;
    }
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.RESEND_API_KEY;
    delete process.env.MAIL_FROM;
    await closeDb();
    const dataRoot = resolve('.data') + sep;
    assert.ok(directory.startsWith(dataRoot));
    await rm(directory, { recursive: true, force: true });
  }
});
