import { getCollege } from "@/features/scraping/server/db/repository/college_repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const data = await getCollege(id);
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
