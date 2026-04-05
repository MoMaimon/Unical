import { getSection } from "@/lib/db/repositories/section_repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const course = await getSection(id);

    if (!course) {
      return NextResponse.json(
        { message: "Section not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Section fetched successfully.", data: course },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch section", details: error.message },
      { status: 500 },
    );
  }
};
