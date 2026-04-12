// clients/BauApiClient.ts
import { config } from "../config";
import { withRetry } from "../utils/retry";
import { logger } from "../utils/logger";

export class BauApiClient {
  constructor(private baseConfig = config) {}

  private async requestRaw(method: string, params: number[]): Promise<string> {
    const body = new URLSearchParams();
    body.append("method", method);
    body.append("paramsCount", params.length.toString());
    params.forEach((p, idx) => body.append(`param${idx}`, p.toString()));

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.baseConfig.api.timeoutMs
    );

    try {
      const res = await fetch(this.baseConfig.api.url, {
        method: "POST",
        headers: this.baseConfig.headers,
        body,
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }
      return await res.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private fixMalformedJson(raw: string): string {
    return raw.replace(/'/g, '"');
  }

  async request<T = any>(method: string, params: number[] = []): Promise<T> {
    const raw = await withRetry(() => this.requestRaw(method, params), {
      retries: this.baseConfig.api.retries,
      delayMs: this.baseConfig.api.retryDelayMs,
    });
    const fixed = this.fixMalformedJson(raw);
    try {
      return JSON.parse(fixed) as T;
    } catch (err) {
      logger.error("Failed to parse API response", { raw: fixed });
      throw new Error("Invalid JSON from API");
    }
  }

  async getPagesCount(
    degreeId: number,
    collegeId: number,
    departmentId: number
  ): Promise<number> {
    const result = await this.request<string>("getCoursesPagesCount", [
      degreeId,
      collegeId,
      departmentId,
    ]);
    const num = Number(result);
    return isNaN(num) ? 0 : num;
  }
}