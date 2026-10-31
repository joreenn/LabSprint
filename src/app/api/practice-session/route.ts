import { authenticated, parseBody } from '@/lib/server/http';
import { clearPracticeInput, practiceInput } from '@/lib/server/validation';
import { clearPractice, savePractice } from '@/lib/server/workspace';
export const dynamic = 'force-dynamic';
export const PUT = authenticated(async (request, user) => {
  const input = await parseBody(request, practiceInput);
  return Response.json({ activeSession: await savePractice(user.id, input) });
});
export const DELETE = authenticated(async (request, user) => {
  const { sessionId } = await parseBody(request, clearPracticeInput);
  await clearPractice(user.id, sessionId);
  return Response.json({ ok: true });
});
