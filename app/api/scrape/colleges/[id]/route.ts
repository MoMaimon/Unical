import { getCollege } from "@/lib/Scraping/scrape_service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    if (!Number.isInteger(Number(id))) {
      return NextResponse.json(
        { message: "Invalid College ID" },
        { status: 400 },
      );
    }
    const data = await getCollege(Number(id));
    if (!data) {
      return NextResponse.json(
        { message: "College not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "College fetched successfully.", data: data },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch college", details: error.message },
      { status: 500 },
    );
  }
};
