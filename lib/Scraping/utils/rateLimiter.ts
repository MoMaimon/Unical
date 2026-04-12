// utils/rateLimiter.ts
import pLimit from "p-limit";

/**
 * Returns a random delay between baseDelayMs and baseDelayMs * 2
 * (adds jitter to avoid detection)
 */
function getRandomDelay(baseDelayMs: number): number {
  const jitter = Math.random() * baseDelayMs; // 0 to baseDelayMs
  return baseDelayMs + jitter;
}

export class RateLimiter {
  private limit: ReturnType<typeof pLimit>;

  constructor(
    private maxConcurrent: number,
    private delayBetweenTasksMs: number = 0
  ) {
    this.limit = pLimit(maxConcurrent);
  }

  async run<T>(tasks: Array<() => Promise<T>>): Promise<T[]> {
    const results: Promise<T>[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const wrapped = this.limit(async () => {
        const res = await task();
        if (this.delayBetweenTasksMs > 0 && i < tasks.length - 1) {
          const delayWithJitter = getRandomDelay(this.delayBetweenTasksMs);
          await new Promise((r) => setTimeout(r, delayWithJitter));
        }
        return res;
      });
      results.push(wrapped);
    }
    return Promise.all(results);
  }
}