export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function api<T>(url: string, method = 'GET', body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
      signal: controller.signal,
    });
    const data = await response.json().catch(() => {
      throw new Error('The server could not respond. Please retry.');
    });
    if (!response.ok)
      throw new ApiError(response.status, data.error || 'Something went wrong. Please try again.');
    return data;
  } catch (error) {
    if (controller.signal.aborted)
      throw new Error('The connection took too long. Your pending answers can be retried.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
