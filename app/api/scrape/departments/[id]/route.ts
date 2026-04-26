import { getDepartment } from "@/features/scraping/server/db/repository/department_repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const data = await getDepartment(id);
    if (!data) {
      return NextResponse.json(
        { message: "Department not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Department fetched successfully.", data: data },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch department", details: error.message },
      { status: 500 },
    );
  }
};
