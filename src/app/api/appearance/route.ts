import { authenticated, parseBody } from '@/lib/server/http';
import { appearanceInput } from '@/lib/server/validation';
import { saveAppearance } from '@/lib/server/workspace';

export const dynamic = 'force-dynamic';
export const PUT = authenticated(async (request, user) => {
  const appearance = await parseBody(request, appearanceInput);
  await saveAppearance(user.id, appearance);
  return Response.json({ appearance });
});
