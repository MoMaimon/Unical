import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.method === "POST") {
    const authHeader = request.headers.get("authorization");
    const expectedKey = process.env.ADMIN_API_KEY;

    if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json(
        { error: "Unauthorized access: Invalid or missing Admin API Key" },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/scrape/:path*",
};
