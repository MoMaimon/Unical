
import { getDegree } from "@/features/scraping/server/db/repository/degree_repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    if (!Number.isInteger(Number(id))) {
      return NextResponse.json(
        { message: "Invalid Degree ID" },
        { status: 400 },
      );
    }
    const data = await getDegree(Number(id));
    if (!data) {
      return NextResponse.json(
        { message: "Degree not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Degree fetched successfully.", data: data },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch degree", details: error.message },
      { status: 500 },
    );
  }
};
