import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { migrations } from '../src/db/migrations';

test('appearance migration preserves pre-existing accounts, progress and settings', async () => {
  const client = new PGlite();
  try {
    await client.exec(migrations[0].sql);
    await client.exec(`INSERT INTO app_user(id,name,email) VALUES ('existing','Existing learner','existing@example.test');
      INSERT INTO study_preferences(user_id,settings,active_session) VALUES ('existing','{"dailyGoal":20,"mtapDate":null,"mockDate":null}','{"id":"saved-session","index":0,"questionIds":["cc-001"],"answers":{}}');
      INSERT INTO attempt(id,user_id,session_id,question_id,option_id,correct,question_version) VALUES ('attempt','existing','saved-session','cc-001','C',true,1);`);
    await client.exec(migrations[1].sql);
    await client.exec(migrations[1].sql);
    await client.exec(migrations[2].sql);
    await client.exec(migrations[2].sql);
    await client.exec(migrations[3].sql);
    await client.exec(migrations[3].sql);
    const row = (
      await client.query<{ dailyGoal: number; sessionId: string; appearance: null }>(
        `SELECT (settings->>'dailyGoal')::int AS "dailyGoal", active_session->>'id' AS "sessionId", appearance FROM study_preferences WHERE user_id='existing'`,
      )
    ).rows[0];
    assert.equal(row.dailyGoal, 20);
    assert.equal(row.sessionId, 'saved-session');
    assert.equal(row.appearance, null);
    assert.equal((await client.query('SELECT * FROM attempt')).rows.length, 1);
  } finally {
    await client.close();
  }
});
