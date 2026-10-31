import { authenticated, parseBody } from '@/lib/server/http';
import { reportInput } from '@/lib/server/validation';
import { addReport } from '@/lib/server/workspace';
export const dynamic = 'force-dynamic';
export const POST = authenticated(async (request, user) => {
  const input = await parseBody(request, reportInput);
  await addReport(user.id, input.questionId, input.reason);
  return Response.json({ ok: true });
});
