import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

test('database auth, answer validation, idempotency, account isolation and resumable sessions', async () => {
  const directory = resolve('.data', `backend-test-${randomUUID()}`);
  process.env.LABSPRINT_DATA_DIR = directory;
  process.env.BETTER_AUTH_URL = 'http://127.0.0.1:3000';
  const { getAuth } = await import('../src/lib/auth');
  const { getDb, closeDb } = await import('../src/db');
  const tables = await import('../src/db/schema');
  const { questions } = await import('../src/content/questions');
  const workspace = await import('../src/lib/server/workspace');
  const { attemptInput, settingsInput, scoreAnswer } = await import('../src/lib/server/validation');
  const { GET: workspaceRoute } = await import('../src/app/api/workspace/route');
  const { POST: bookmarkRoute } = await import('../src/app/api/bookmarks/route');
  const { POST: attemptRoute } = await import('../src/app/api/attempts/route');
  const { PUT: appearanceRoute } = await import('../src/app/api/appearance/route');
  const { eq } = await import('drizzle-orm');
  try {
    const auth = await getAuth();
    const signup = async (email: string) => {
      const response = await auth.handler(
        new Request('http://127.0.0.1:3000/api/auth/sign-up/email', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            origin: 'http://127.0.0.1:3000',
            'x-real-ip': email.includes('one') ? '127.0.0.1' : '127.0.0.2',
          },
          body: JSON.stringify({
            name: 'Reviewer Test',
            email,
            password: 'Test-only-password-2026',
          }),
        }),
      );
      const body = await response.json();
      assert.equal(response.status, 200, JSON.stringify(body));
      const cookie = response.headers
        .getSetCookie()
        .map((c) => c.split(';')[0])
        .join('; ');
      assert.ok(cookie.includes('labsprint.session_token='));
      return { user: body.user as { id: string; name: string; email: string }, cookie };
    };
    const one = await signup('one@example.test');
    const two = await signup('two@example.test');
    const db = await getDb();
    const [account] = await db
      .select()
      .from(tables.account)
      .where(eq(tables.account.userId, one.user.id));
    assert.ok(account.password);
    assert.notEqual(account.password, 'Test-only-password-2026');
    const unauthorized = await workspaceRoute(new Request('http://127.0.0.1:3000/api/workspace'));
    assert.equal(unauthorized.status, 401);
    const hostile = await bookmarkRoute(
      new Request('http://127.0.0.1:3000/api/bookmarks', {
        method: 'POST',
        headers: {
          origin: 'https://hostile.example',
          'content-type': 'application/json',
          cookie: one.cookie,
        },
        body: JSON.stringify({ questionId: questions[0].id, bookmarked: true }),
      }),
    );
    assert.equal(hostile.status, 403);
    const reconstructed = await bookmarkRoute(
      new Request('http://localhost:3000/api/bookmarks', {
        method: 'POST',
        headers: {
          origin: 'http://127.0.0.1:3000',
          'content-type': 'application/json',
          cookie: one.cookie,
          'sec-fetch-site': 'same-origin',
        },
        body: JSON.stringify({ questionId: questions[0].id, bookmarked: true }),
      }),
    );
    assert.equal(
      reconstructed.status,
      200,
      'Explicitly trusted loopback origin must work when Next reconstructs localhost.',
    );
    const crossSite = await bookmarkRoute(
      new Request('http://localhost:3000/api/bookmarks', {
        method: 'POST',
        headers: {
          origin: 'http://127.0.0.1:3000',
          'content-type': 'application/json',
          cookie: one.cookie,
          'sec-fetch-site': 'cross-site',
        },
        body: JSON.stringify({ questionId: questions[0].id, bookmarked: true }),
      }),
    );
    assert.equal(crossSite.status, 403);
    const authorized = await workspaceRoute(
      new Request('http://127.0.0.1:3000/api/workspace', { headers: { cookie: one.cookie } }),
    );
    assert.equal(authorized.status, 200);
    const question = questions[0];
    const wrong = question.options.find((o) => o.id !== question.correctOptionId)!;
    assert.equal(scoreAnswer(question.id, 'not-an-option'), null);
    assert.equal(scoreAnswer(question.id, wrong.id)?.correct, false);
    assert.equal(scoreAnswer(question.id, question.correctOptionId)?.correct, true);
    assert.equal(
      attemptInput.safeParse({
        id: randomUUID(),
        sessionId: randomUUID(),
        questionId: question.id,
        optionId: wrong.id,
        userId: two.user.id,
      }).success,
      false,
    );
    assert.equal(
      settingsInput.safeParse({ dailyGoal: 10, mtapDate: '2026-02-30', mockDate: null }).success,
      false,
    );
    const sessionId = randomUUID();
    await workspace.savePractice(one.user.id, {
      id: sessionId,
      questionIds: [question.id],
      index: 0,
      answers: { [question.id]: question.correctOptionId },
      replaceSessionId: null,
    });
    assert.deepEqual((await workspace.getWorkspace(one.user)).activeSession?.answers, {});
    const input = { id: randomUUID(), sessionId, questionId: question.id, optionId: wrong.id };
    const first = await workspace.recordAttempt(one.user.id, input);
    assert.equal(first.correct, false);
    const retry = await workspace.recordAttempt(one.user.id, { ...input, id: randomUUID() });
    assert.equal(retry.id, first.id);
    const concurrentRetries = await Promise.all(
      [1, 2].map(() => workspace.recordAttempt(one.user.id, { ...input, id: randomUUID() })),
    );
    assert.ok(concurrentRetries.every((attempt) => attempt.id === first.id));
    await assert.rejects(
      () =>
        workspace.recordAttempt(one.user.id, {
          ...input,
          id: randomUUID(),
          optionId: question.correctOptionId,
        }),
      /already been answered/,
    );
    await assert.rejects(
      () => workspace.recordAttempt(two.user.id, { ...input, id: randomUUID() }),
      /practice changed/,
    );
    await workspace.setBookmark(one.user.id, question.id, true);
    await workspace.saveSettings(one.user.id, { dailyGoal: 15, mtapDate: null, mockDate: null });
    await workspace.addReport(one.user.id, question.id, 'Please check this explanation.');
    await workspace.savePractice(one.user.id, {
      id: sessionId,
      questionIds: [question.id],
      index: 1,
      answers: {},
    });
    const saved = await workspace.getWorkspace(one.user);
    assert.equal(saved.attempts.length, 1);
    assert.equal(saved.settings.dailyGoal, 15);
    assert.equal(saved.reports.length, 1);
    assert.deepEqual(saved.bookmarks, [question.id]);
    assert.equal(saved.activeSession?.answers[question.id], wrong.id);
    assert.equal(saved.activeSession?.index, 1);
    const staleIndex = await workspace.savePractice(one.user.id, {
      id: sessionId,
      questionIds: [question.id],
      index: 0,
      answers: {},
    });
    assert.equal(staleIndex.index, 1, 'An older device cannot move the shared position backward.');
    const other = await workspace.getWorkspace(two.user);
    assert.equal(other.attempts.length, 0);
    assert.equal(other.bookmarks.length, 0);
    assert.equal(other.reports.length, 0);
    assert.equal(other.activeSession, null);
    const newerSession = {
      id: randomUUID(),
      questionIds: [question.id],
      index: 0,
      answers: {},
      replaceSessionId: sessionId,
    };
    await workspace.savePractice(one.user.id, newerSession);
    await assert.rejects(
      () =>
        workspace.savePractice(one.user.id, {
          id: sessionId,
          questionIds: [question.id],
          index: 1,
          answers: {},
        }),
      /practice changed/,
    );
    await assert.rejects(() => workspace.clearPractice(one.user.id, sessionId), /practice changed/);
    assert.equal((await workspace.getWorkspace(one.user)).activeSession?.id, newerSession.id);
    const starts = await Promise.allSettled(
      [1, 2].map(() =>
        workspace.savePractice(one.user.id, {
          id: randomUUID(),
          questionIds: [question.id],
          index: 0,
          answers: {},
          replaceSessionId: newerSession.id,
        }),
      ),
    );
    assert.equal(
      starts.filter((result) => result.status === 'fulfilled').length,
      1,
      'Only one concurrent replacement of the same session can succeed.',
    );
    assert.equal(starts.filter((result) => result.status === 'rejected').length, 1);
    const latestSession = (await workspace.getWorkspace(one.user)).activeSession!;
    await workspace.clearPractice(one.user.id, latestSession.id);
    assert.equal((await workspace.getWorkspace(one.user)).activeSession, null);
    await assert.rejects(
      () => workspace.savePractice(one.user.id, { ...latestSession, replaceSessionId: undefined }),
      /practice changed/,
    );
    const signout = await auth.handler(
      new Request('http://127.0.0.1:3000/api/auth/sign-out', {
        method: 'POST',
        headers: {
          cookie: one.cookie,
          origin: 'http://127.0.0.1:3000',
          'content-type': 'application/json',
          'x-real-ip': '127.0.0.1',
        },
        body: '{}',
      }),
    );
    assert.equal(signout.status, 200);
    const invalidated = await workspaceRoute(
      new Request('http://127.0.0.1:3000/api/workspace', { headers: { cookie: one.cookie } }),
    );
    assert.equal(invalidated.status, 401);
    const signIn = await auth.handler(
      new Request('http://127.0.0.1:3000/api/auth/sign-in/email', {
        method: 'POST',
        headers: {
          origin: 'http://127.0.0.1:3000',
          'content-type': 'application/json',
          'x-real-ip': '127.0.0.3',
        },
        body: JSON.stringify({ email: one.user.email, password: 'Test-only-password-2026' }),
      }),
    );
    assert.equal(signIn.status, 200);
    const freshCookie = signIn.headers
      .getSetCookie()
      .map((c) => c.split(';')[0])
      .join('; ');
    const restored = await workspaceRoute(
      new Request('http://127.0.0.1:3000/api/workspace', { headers: { cookie: freshCookie } }),
    );
    assert.equal(restored.status, 200);
    assert.equal((await restored.json()).attempts.length, 1);

    const theme = {
      presetId: 'rose-cloud',
      accent: '#c8558e',
      secondary: '#f0a6ca',
      style: 'gradient' as const,
    };
    const themeResponse = await appearanceRoute(
      new Request('http://127.0.0.1:3000/api/appearance', {
        method: 'PUT',
        headers: {
          origin: 'http://127.0.0.1:3000',
          'content-type': 'application/json',
          cookie: freshCookie,
        },
        body: JSON.stringify(theme),
      }),
    );
    assert.equal(themeResponse.status, 200);
    assert.deepEqual((await workspace.getWorkspace(one.user)).appearance, theme);
    assert.equal(
      (await workspace.getWorkspace(one.user)).settings.dailyGoal,
      15,
      'Appearance changes preserve study preferences.',
    );
    assert.deepEqual(
      (await workspace.getWorkspace(two.user)).appearance,
      workspace.defaultAppearance,
      'Appearance is private to its owner.',
    );
    const maliciousTheme = await appearanceRoute(
      new Request('http://127.0.0.1:3000/api/appearance', {
        method: 'PUT',
        headers: {
          origin: 'http://127.0.0.1:3000',
          'content-type': 'application/json',
          cookie: freshCookie,
        },
        body: JSON.stringify({ ...theme, accent: 'url(https://malicious.test/tracker)' }),
      }),
    );
    assert.equal(maliciousTheme.status, 400, 'Only literal color values may be saved.');

    const checkpointSession = {
      id: randomUUID(),
      questionIds: questions.slice(0, 3).map((q) => q.id),
      index: 0,
      answers: {},
      replaceSessionId: null,
    };
    await workspace.savePractice(one.user.id, checkpointSession);
    const checkpointInput = {
      id: randomUUID(),
      sessionId: checkpointSession.id,
      questionId: questions[0].id,
      optionId: questions[0].correctOptionId,
      nextIndex: 99,
    };
    const checkpointResponse = await attemptRoute(
      new Request('http://127.0.0.1:3000/api/attempts', {
        method: 'POST',
        headers: {
          origin: 'http://127.0.0.1:3000',
          'content-type': 'application/json',
          cookie: freshCookie,
        },
        body: JSON.stringify(checkpointInput),
      }),
    );
    assert.equal(checkpointResponse.status, 200);
    const checkpoint = await checkpointResponse.json();
    assert.equal(
      checkpoint.attempt.correct,
      true,
      'The server, not the client, scores the option.',
    );
    assert.equal(
      checkpoint.activeSession.index,
      1,
      'One answer checkpoints the next question without a second request.',
    );
    assert.equal(checkpoint.activeSession.answers[questions[0].id], questions[0].correctOptionId);
    const repeated = await workspace.submitAnswer(one.user.id, {
      ...checkpointInput,
      id: randomUUID(),
    });
    assert.equal(
      repeated.attempt.id,
      checkpoint.attempt.id,
      'Retrying the combined save does not duplicate a score.',
    );
    assert.equal(repeated.activeSession?.index, 1);
    const outOfOrder = await workspace.submitAnswer(one.user.id, {
      id: randomUUID(),
      sessionId: checkpointSession.id,
      questionId: questions[2].id,
      optionId: questions[2].correctOptionId,
      nextIndex: 99,
    });
    assert.equal(
      outOfOrder.activeSession?.index,
      1,
      'A requested checkpoint cannot skip unanswered questions.',
    );
    const last = await workspace.submitAnswer(one.user.id, {
      id: randomUUID(),
      sessionId: checkpointSession.id,
      questionId: questions[1].id,
      optionId: questions[1].correctOptionId,
      nextIndex: 99,
    });
    assert.equal(
      last.activeSession?.index,
      2,
      'A fully answered session retains its last question for rationale review.',
    );
    await db
      .update(tables.preferences)
      .set({ activeSession: { ...checkpointSession, index: 2, answers: {} } })
      .where(eq(tables.preferences.userId, one.user.id));
    const repaired = await workspace.submitAnswer(one.user.id, {
      ...checkpointInput,
      id: randomUUID(),
    });
    assert.equal(
      Object.keys(repaired.activeSession?.answers || {}).length,
      3,
      'Canonical saved attempts repair a stale pre-upgrade checkpoint.',
    );
    assert.equal(repaired.activeSession?.index, 2, 'A replay cannot move the session backward.');
    await workspace.clearPractice(one.user.id, checkpointSession.id);
    await workspace.clearPractice(one.user.id, checkpointSession.id);
    assert.equal(
      (await workspace.getWorkspace(one.user)).activeSession,
      null,
      'A lost-response finish retry is idempotent.',
    );
    const lateReplay = await workspace.submitAnswer(one.user.id, {
      ...checkpointInput,
      id: randomUUID(),
    });
    assert.equal(
      lateReplay.activeSession,
      null,
      'A delayed replay never reopens an ended session.',
    );

    let lockedStatus = 0;
    for (let i = 0; i < 11; i++) {
      const response = await auth.handler(
        new Request('http://127.0.0.1:3000/api/auth/sign-in/email', {
          method: 'POST',
          headers: {
            origin: 'http://127.0.0.1:3000',
            'content-type': 'application/json',
            'x-real-ip': '127.0.0.9',
          },
          body: JSON.stringify({ email: 'absent@example.test', password: 'Wrong-password-2026' }),
        }),
      );
      lockedStatus = response.status;
    }
    assert.equal(
      lockedStatus,
      429,
      'Persistent database rate limiter must reject excessive login attempts.',
    );
  } finally {
    await closeDb();
    const allowed = resolve('.data') + sep;
    assert.ok(directory.startsWith(allowed) && directory.includes('backend-test-'));
    await rm(directory, { recursive: true, force: true });
  }
});
