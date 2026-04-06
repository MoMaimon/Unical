import { getDepartment } from "@/lib/db/repositories/department_repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    if (!Number.isInteger(Number(id))) {
      return NextResponse.json(
        { message: "Invalid Department ID" },
        { status: 400 },
      );
    }
    const data = await getDepartment(Number(id));
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
