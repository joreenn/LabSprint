import { authenticated } from '@/lib/server/http';
import { getSessionPage, getSessionDetail } from '@/lib/server/history';
export const dynamic = 'force-dynamic';
export const GET = authenticated(async (request, user) => {
  const params = new URL(request.url).searchParams;
  return Response.json(
    params.has('sessionId')
      ? await getSessionDetail(user.id, params.get('sessionId') || '')
      : await getSessionPage(user.id, params.get('cursor')),
  );
});
