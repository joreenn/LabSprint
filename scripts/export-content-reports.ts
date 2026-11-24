import { config } from 'dotenv';
import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { asc, gt } from 'drizzle-orm';
import { getDb, closeDb } from '../src/db';
import { reports } from '../src/db/schema';
config({ path: '.env.local', quiet: true });
const output = resolve('tmp', 'content-reports.ndjson');
try {
  const db = await getDb();
  await mkdir(resolve('tmp'), { recursive: true });
  await writeFile(output, '', { mode: 0o600 });
  let cursor = '';
  let count = 0;
  // Fixed-size pages; no learner email or credential columns are selected.
  for (;;) {
    const rows = await db
      .select({
        id: reports.id,
        questionId: reports.questionId,
        reason: reports.reason,
        createdAt: reports.createdAt,
      })
      .from(reports)
      .where(cursor ? gt(reports.id, cursor) : undefined)
      .orderBy(asc(reports.id))
      .limit(200);
    if (!rows.length) break;
    await appendFile(
      output,
      rows.map((row) => JSON.stringify({ ...row, reportedVersion: null })).join('\n') + '\n',
    );
    count += rows.length;
    cursor = rows.at(-1)!.id;
  }
  console.log(
    `Exported ${count} reports to the private tmp/content-reports.ndjson file. No database records changed.`,
  );
} catch {
  console.error(
    'Report export failed. Check your private database configuration. No report text or credentials are logged.',
  );
  process.exitCode = 1;
} finally {
  await closeDb();
}
