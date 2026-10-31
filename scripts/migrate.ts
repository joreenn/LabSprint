import { config } from 'dotenv';
config({ path: '.env.local', quiet: true });
config({ path: '.env', quiet: true });

async function main() {
  const { migrate, closeDb } = await import('../src/db');
  try {
    await migrate();
    console.log('LabSprint database migrations applied.');
  } finally {
    await closeDb();
  }
}
main().catch((error) => {
  console.error('Migration failed:', error instanceof Error ? error.message : 'Unknown error');
  process.exitCode = 1;
});
