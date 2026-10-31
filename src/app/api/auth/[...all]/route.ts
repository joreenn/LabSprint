import { getAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
async function handle(request: Request) {
  try {
    return await (await getAuth()).handler(request);
  } catch (error) {
    console.error(
      'Authentication initialization failed.',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return Response.json(
      { error: 'Sign-in is temporarily unavailable. Please try again.' },
      { status: 503 },
    );
  }
}
export { handle as GET, handle as POST };
