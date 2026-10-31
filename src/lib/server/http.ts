import { ZodError, type ZodType } from 'zod';
import { getAuth, getTrustedOrigins } from '../auth';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function parseBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  if (!request.headers.get('content-type')?.includes('application/json'))
    throw new HttpError(415, 'Please send JSON.');
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'A request body is required.');
  const decoder = new TextDecoder();
  let length = 0,
    text = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 64 * 1024) {
      await reader.cancel();
      throw new HttpError(413, 'Request is too large.');
    }
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new HttpError(400, 'Invalid JSON.');
  }
  return schema.parse(body);
}

type Viewer = { id: string; name: string; email: string };
export function authenticated(handler: (request: Request, user: Viewer) => Promise<Response>) {
  return async (request: Request) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        const origin = request.headers.get('origin');
        // Next may reconstruct request.url using localhost even when a local browser
        // opened 127.0.0.1. Use the same explicit trust list as authentication.
        const allowed = getTrustedOrigins();
        if (
          (origin && !allowed.includes(origin)) ||
          request.headers.get('sec-fetch-site') === 'cross-site'
        ) {
          throw new HttpError(403, 'This request must come from LabSprint.');
        }
      }
      const auth = await getAuth();
      const viewer = await auth.api.getSession({ headers: request.headers });
      if (!viewer) throw new HttpError(401, 'Please sign in to continue.');
      const response = await handler(request, viewer.user);
      response.headers.set('Cache-Control', 'private, no-store');
      return response;
    } catch (error) {
      if (error instanceof HttpError)
        return Response.json(
          { error: error.message },
          { status: error.status, headers: { 'Cache-Control': 'no-store' } },
        );
      if (error instanceof ZodError)
        return Response.json(
          { error: error.issues[0]?.message || 'Invalid request.' },
          { status: 400 },
        );
      console.error(
        'Workspace request failed.',
        error instanceof Error ? error.message : 'Unknown error',
      );
      return Response.json(
        { error: 'We could not save or load your data. Please try again.' },
        { status: 500 },
      );
    }
  };
}
