import { authenticated } from '@/lib/server/http';
import { getWorkspace } from '@/lib/server/workspace';
export const dynamic = 'force-dynamic';
export const GET = authenticated(async (_request, user) => Response.json(await getWorkspace(user)));
