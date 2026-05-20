import { NextResponse } from "next/server";
import { ProviderFactory } from "@/features/db/providers/ProviderFactory";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("q");

  if (!searchTerm) {
    return NextResponse.json([]);
  }

  try {
    // Use your factory to get the provider, then call the new method
    const provider = ProviderFactory.getProvider("BAU");
    const courses = await provider.searchCourses(searchTerm);

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Fuzzy search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
