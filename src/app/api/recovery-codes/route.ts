import { z } from 'zod';
import { authenticated, parseBody } from '@/lib/server/http';
import { generateRecoveryCodes, limitRecovery, recoveryStatus } from '@/lib/recovery-codes';

export const dynamic = 'force-dynamic';
const input = z.object({ password: z.string().min(1).max(128) }).strict();

export const GET = authenticated(async (_request, user) =>
  Response.json(await recoveryStatus(user.id)),
);

export const POST = authenticated(async (request, user) => {
  const { password } = await parseBody(request, input);
  await limitRecovery([{ key: `recovery-generate:${user.id}`, max: 5, seconds: 15 * 60 }]);
  const codes = await generateRecoveryCodes(user.id, password);
  return Response.json({ codes }, { headers: { 'Cache-Control': 'private, no-store' } });
});
