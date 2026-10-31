import { authenticated, parseBody } from '@/lib/server/http';
import { settingsInput } from '@/lib/server/validation';
import { saveSettings } from '@/lib/server/workspace';
export const dynamic = 'force-dynamic';
export const PUT = authenticated(async (request, user) => {
  const input = await parseBody(request, settingsInput);
  await saveSettings(user.id, input);
  return Response.json({ ok: true });
});
