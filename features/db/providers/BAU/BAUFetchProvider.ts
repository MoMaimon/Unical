import { College, Course, Department, Degree, Section } from "@/types/Data";
import { IFetchProvider } from "../../IFetchProvider";
import { config } from "../../utils/config";
import { withRetry } from "../../utils/retry";
import { logger } from "@/lib/utils/logger";
import { CollegeApiResponse, CourseApiResponse, DegreeApiResponse, DepartmentApiResponse, SectionApiResponse } from "../../types/APIResponse";

export class BAUFetchProvider implements IFetchProvider {
    private readonly baseConfig = config;
    private readonly DEFAULT_HEADERS = {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,ar;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua":
            '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        Referer: "https://app2.bau.edu.jo:7799/courses/index.jsp",
    };


    private getRandomUserAgent(): string {
        const agents = this.baseConfig.userAgents;
        const randomIndex = Math.floor(Math.random() * agents.length);
        return agents[randomIndex];
    }

    private getHeaders() {
        return {
            ...this.baseConfig.baseHeaders,
            "User-Agent": this.getRandomUserAgent(),
        };
    }

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
                headers: this.getHeaders(),
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

    private parseJsonText(raw: string): string {
        return raw.replace(/'/g, '"');
    }

    async request<T = any>(method: string, params: number[] = []): Promise<T> {
        const raw = await withRetry(() => this.requestRaw(method, params), {
            retries: this.baseConfig.api.retries,
            delayMs: this.baseConfig.api.retryDelayMs,
            backoffFactor: 2,
        });
        const fixed = this.parseJsonText(raw);
        try {
            return JSON.parse(fixed) as T;
        } catch (err) {
            logger.error("Failed to parse API response", { raw: fixed });
            throw new Error("Invalid JSON from API");
        }
    }


    async fetchDegrees(): Promise<DegreeApiResponse[]> {
        return await this.request<DegreeApiResponse[]>("getDegrees");
    }

    async fetchColleges(): Promise<CollegeApiResponse[]> {
        return await this.request<CollegeApiResponse[]>("getColleges");
    }

    async fetchDepartments(collegeId: string): Promise<DepartmentApiResponse[]> {
        return this.request<DepartmentApiResponse[]>("getDepartments", [Number(collegeId)])
    }

    async fetchCourses(degreeId: string, collegeId: string, departmentId: string): Promise<CourseApiResponse[]> {
        return this.request<CourseApiResponse[]>("getCourses", [Number(degreeId), Number(collegeId), Number(departmentId)])
    }

    async fetchSections(degreeId: string, collegeId: string, departmentId: string): Promise<SectionApiResponse[]> {
        return this.request<SectionApiResponse[]>("getCourses", [Number(degreeId), Number(collegeId), Number(departmentId)])
    }
}