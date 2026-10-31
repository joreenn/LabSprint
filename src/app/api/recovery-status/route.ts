import { isRecoveryConfigured } from '@/lib/mail';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(
    { enabled: isRecoveryConfigured() },
    {
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
