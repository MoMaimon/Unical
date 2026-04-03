import { getCourse } from "@/lib/Scraping/scrape_service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    if (!Number.isInteger(Number(id))) {
      return NextResponse.json(
        { message: "Invalid Course ID" },
        { status: 400 },
      );
    }

    const course = await getCourse(Number(id));

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Course fetched successfully.", data: course },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch course", details: error.message },
      { status: 500 },
    );
  }
};
