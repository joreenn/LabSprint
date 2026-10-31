import { authenticated, parseBody } from '@/lib/server/http';
import { bookmarkInput } from '@/lib/server/validation';
import { setBookmark } from '@/lib/server/workspace';
export const dynamic = 'force-dynamic';
export const POST = authenticated(async (request, user) => {
  const input = await parseBody(request, bookmarkInput);
  await setBookmark(user.id, input.questionId, input.bookmarked);
  return Response.json({ ok: true });
});
