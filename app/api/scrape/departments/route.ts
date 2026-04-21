import { getDepartments, getDepartmentsByCollege } from "@/features/scraping/server/db/repository/department_repository";
import { syncDepartments } from "@/features/scraping/server/services/scrape_service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;

    const collegeId = searchParams.get("college");
    if (!collegeId) {
      const data = await getDepartments();
      return NextResponse.json(
        {
          message: "Departments fetched successfully",
          data: data,
        },
        { status: 200 },
      );
    } else {
      const data = await getDepartmentsByCollege(collegeId);
      return NextResponse.json(
        {
          message: "Departments fetched successfully",
          data: data,
        },
        { status: 200 },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch departments",
        details: error.message,
      },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await syncDepartments();
    return NextResponse.json(
      {
        message: "Departments synced successfully.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to sync departments",
        details: error.message,
      },
      { status: 500 },
    );
  }
};
