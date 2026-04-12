// config.ts
export const config = {
  api: {
    url: process.env.BAU_API_URL || "https://app2.bau.edu.jo:7799/courses/actions/rmiMethod",
    timeoutMs: 15000,
    retries: 3,
    retryDelayMs: 1000,
  },
  scraping: {
    defaultDelayMs: 300,
    maxConcurrentPages: 2,
    collegeBlacklist: [14, 12] as number[],
    knownOnlineCourses: [
      "35004101",
      "35004102",
      "35003101",
      "35003102",
      "35005100",
      "35005101",
    ] as string[],
  },
  headers: {
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
  },
} as const;