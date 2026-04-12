// utils/rateLimiter.ts
import pLimit from "p-limit";

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
          await new Promise((r) => setTimeout(r, this.delayBetweenTasksMs));
        }
        return res;
      });
      results.push(wrapped);
    }
    return Promise.all(results);
  }
}