import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

test(
  'recovery rejects stale password proofs and contains denied recovery accounting',
  { timeout: 90_000 },
  async (t) => {
    assert.ok(
      !process.env.DATABASE_URL,
      'Security regression tests require a disposable local database.',
    );
    const directory = resolve('.data', `recovery-security-${randomUUID()}`);
    process.env.LABSPRINT_DATA_DIR = directory;
    process.env.BETTER_AUTH_URL = 'http://127.0.0.1:3000';
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      throw new Error('Network is forbidden in this test.');
    };
    const { getAuth } = await import('../src/lib/auth');
    const { getDb, closeDb } = await import('../src/db');
    const tables = await import('../src/db/schema');
    const recovery = await import('../src/lib/recovery-codes');
    const { eq } = await import('drizzle-orm');
    try {
      const auth = await getAuth();
      const context = await auth.$context;
      const db = await getDb();
      const origin = 'http://127.0.0.1:3000';
      const password = 'Original-security-password-2026';
      const recoveredPassword = 'Recovered-security-password-2026';
      let sequence = 30;
      const cookieOf = (response: Response) =>
        response.headers
          .getSetCookie()
          .map((v) => v.split(';')[0])
          .join('; ');
      const post = (path: string, body: unknown, ip: string, cookie?: string) =>
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
      const fixture = async () => {
        const ip = `127.0.0.${++sequence}`;
        const email = `security-${sequence}@example.test`;
        const signup = await post('sign-up/email', { name: 'Dummy learner', email, password }, ip);
        assert.equal(signup.status, 200);
        const { user } = await signup.json();
        return {
          ip,
          email,
          user: user as { id: string },
          cookie: cookieOf(signup),
          codes: await recovery.generateRecoveryCodes(user.id, password),
        };
      };
      type Fixture = Awaited<ReturnType<typeof fixture>>;
      const race = async (
        account: Fixture,
        path: string,
        body: unknown,
        reset: () => Promise<void>,
      ) => {
        const reached = Promise.withResolvers<void>();
        const resume = Promise.withResolvers<void>();
        const verify = context.password.verify;
        let paused = false;
        context.password.verify = async (input) => {
          const valid = await verify(input);
          if (valid && input.password === password && !paused) {
            paused = true;
            reached.resolve();
            await resume.promise;
          }
          return valid;
        };
        const pending = post(path, body, account.ip, account.cookie);
        let response: Response;
        try {
          await Promise.race([
            reached.promise,
            pending.then(() => {
              throw new Error('Expected the request to reach password verification.');
            }),
          ]);
          await reset();
        } finally {
          resume.resolve();
          context.password.verify = verify;
          response = await pending;
        }
        return response;
      };

      await t.test('saved-code recovery rejects a delayed old-password sign-in', async () => {
        const account = await fixture();
        const response = await race(
          account,
          'sign-in/email',
          { email: account.email, password },
          async () => {
            assert.equal(
              await recovery.recoverAccount(account.email, account.codes[0], recoveredPassword),
              true,
            );
          },
        );
        assert.equal(response.status, 401);
        assert.equal((await response.json()).code, 'CREDENTIALS_CHANGED');
        assert.equal(
          (await db.select().from(tables.session).where(eq(tables.session.userId, account.user.id)))
            .length,
          0,
        );
        assert.equal(
          await auth.api.getSession({ headers: new Headers({ cookie: account.cookie }) }),
          null,
        );
        assert.equal(
          (
            await post(
              'sign-in/email',
              { email: account.email, password: recoveredPassword },
              account.ip,
            )
          ).status,
          200,
        );
        const direct = await auth.api.signInEmail({
          body: { email: account.email, password: recoveredPassword },
        });
        assert.equal(
          direct.user.id,
          account.user.id,
          'Server API calls use the same guarded adapter.',
        );
      });

      await t.test(
        'a delayed password change cannot undo recovery or revoke its new session',
        async () => {
          const account = await fixture();
          let freshCookie = '';
          const response = await race(
            account,
            'change-password',
            {
              currentPassword: password,
              newPassword: 'Stale-attacker-password-2026',
              revokeOtherSessions: true,
            },
            async () => {
              assert.equal(
                await recovery.recoverAccount(account.email, account.codes[0], recoveredPassword),
                true,
              );
              const login = await post(
                'sign-in/email',
                { email: account.email, password: recoveredPassword },
                account.ip,
              );
              assert.equal(login.status, 200);
              freshCookie = cookieOf(login);
            },
          );
          assert.equal(response.status, 401);
          assert.ok(await auth.api.getSession({ headers: new Headers({ cookie: freshCookie }) }));
          assert.equal(
            (
              await post(
                'sign-in/email',
                { email: account.email, password: 'Stale-attacker-password-2026' },
                account.ip,
              )
            ).status,
            401,
          );
          // The same guard must still permit a current, legitimate password change.
          assert.equal(
            (
              await post(
                'change-password',
                {
                  currentPassword: recoveredPassword,
                  newPassword: 'Legitimate-final-password-2026',
                  revokeOtherSessions: true,
                },
                account.ip,
                freshCookie,
              )
            ).status,
            200,
          );
          assert.equal(
            (
              await post(
                'sign-in/email',
                { email: account.email, password: 'Legitimate-final-password-2026' },
                account.ip,
              )
            ).status,
            200,
          );
        },
      );

      await t.test('email-token recovery rejects a delayed old-password sign-in', async () => {
        const account = await fixture();
        const token = randomUUID();
        await db.insert(tables.verification).values({
          id: randomUUID(),
          identifier: `reset-password:${token}`,
          value: account.user.id,
          expiresAt: new Date(Date.now() + 60_000),
        });
        const response = await race(
          account,
          'sign-in/email',
          { email: account.email, password },
          async () => {
            assert.equal(
              (await post('reset-password', { token, newPassword: recoveredPassword }, account.ip))
                .status,
              200,
            );
          },
        );
        assert.equal(response.status, 401);
        assert.equal(
          (await db.select().from(tables.session).where(eq(tables.session.userId, account.user.id)))
            .length,
          0,
        );
        assert.equal(
          (
            await post(
              'sign-in/email',
              { email: account.email, password: recoveredPassword },
              account.ip,
            )
          ).status,
          200,
        );
      });

      await t.test(
        'an exhausted IP cannot spend a victim quota or allocate more email keys',
        async () => {
          const account = await fixture();
          const request = new Request(`${origin}/api/recover-account`, {
            headers: { 'x-real-ip': '192.0.2.1' },
          });
          const primer = recovery.recoveryRequestKeys(request, 'primer@example.test');
          for (let i = 0; i < 10; i++) {
            try {
              await recovery.limitRecovery(primer);
            } catch (error) {
              assert.equal((error as { status: number }).status, 429);
            }
          }
          const victimKeys = recovery.recoveryRequestKeys(request, account.email);
          for (let i = 0; i < 6; i++) {
            await assert.rejects(
              () => recovery.limitRecovery(victimKeys),
              (e: unknown) => (e as { status: number }).status === 429,
            );
          }
          assert.equal(
            (
              await db
                .select()
                .from(tables.recoveryRateLimit)
                .where(eq(tables.recoveryRateLimit.key, victimKeys[1].key))
            ).length,
            0,
          );
          const fresh = new Request(request.url, { headers: { 'x-real-ip': '192.0.2.2' } });
          await recovery.limitRecovery(recovery.recoveryRequestKeys(fresh, account.email));
          assert.equal(
            await recovery.recoverAccount(account.email, account.codes[0], recoveredPassword),
            true,
          );
          const [denied] = await db
            .select()
            .from(tables.recoveryRateLimit)
            .where(eq(tables.recoveryRateLimit.key, primer[0].key));
          assert.equal(
            denied.count,
            11,
            'Denied counters saturate instead of growing indefinitely.',
          );
        },
      );

      await t.test('expired recovery accounting is pruned in bounded batches', async () => {
        const expiredAt = new Date(Date.now() - 2 * 86400000);
        await db.insert(tables.recoveryRateLimit).values(
          Array.from({ length: 105 }, (_, i) => ({
            key: `expired-${i}`,
            count: 1,
            windowStart: expiredAt,
          })),
        );
        await recovery.limitRecovery([{ key: 'cleanup-test', max: 5, seconds: 900 }]);
        const rows = await db.select().from(tables.recoveryRateLimit);
        assert.equal(rows.filter((r) => r.key.startsWith('expired-')).length, 5);
        assert.ok(rows.some((r) => r.key === 'cleanup-test'));
        await recovery.limitRecovery([{ key: 'cleanup-test', max: 5, seconds: 900 }]);
        assert.equal(
          (await db.select().from(tables.recoveryRateLimit)).filter((r) =>
            r.key.startsWith('expired-'),
          ).length,
          0,
        );
      });
    } finally {
      globalThis.fetch = originalFetch;
      await closeDb();
      assert.ok(directory.startsWith(resolve('.data') + sep));
      await rm(directory, { recursive: true, force: true });
    }
  },
);
