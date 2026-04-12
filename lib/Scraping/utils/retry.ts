export interface RetryOptions {
  retries: number;
  delayMs: number;
  backoffFactor?: number;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error;
  let delay = options.delayMs;
  for (let i = 0; i <= options.retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      if (i === options.retries) break;
      await new Promise((r) => setTimeout(r, delay));
      if (options.backoffFactor) delay *= options.backoffFactor;
    }
  }
  throw lastError!;
}