import { authenticated } from '@/lib/server/http';
import { getCompactWorkspace, historyTimeZone } from '@/lib/server/history';
export const dynamic = 'force-dynamic';
export const GET = authenticated(async (request, user) =>
  Response.json(
    await getCompactWorkspace(
      user,
      historyTimeZone(new URL(request.url).searchParams.get('timeZone')),
    ),
  ),
);
