import { authenticated, parseBody } from '@/lib/server/http';
import { attemptInput } from '@/lib/server/validation';
import { submitAnswer } from '@/lib/server/workspace';
export const dynamic = 'force-dynamic';
export const POST = authenticated(async (request, user) => {
  const input = await parseBody(request, attemptInput);
  return Response.json(await submitAnswer(user.id, input));
});
