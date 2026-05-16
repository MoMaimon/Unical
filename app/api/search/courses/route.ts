import { NextResponse } from "next/server";
import { ProviderFactory } from "@/features/db/providers/ProviderFactory";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("q");

  const provider = ProviderFactory.getProvider("BAU");

  if (!searchTerm) {
    return NextResponse.json([]);
  }

  try {
    const courses = provider.searchCourses(searchTerm);

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Fuzzy search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
