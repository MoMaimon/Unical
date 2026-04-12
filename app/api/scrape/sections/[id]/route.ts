import { getSection } from "@/features/scraping/server/db/repository/section_repository";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Section not found" },
        { status: 404 },
      );
    }
    const course = await getSection(new mongoose.Types.ObjectId(id));

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
