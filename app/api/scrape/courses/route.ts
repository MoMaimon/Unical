import { getCoursesPage } from "@/features/scraping/server/db/repository/course_repository";
import { syncCourses } from "@/features/scraping/server/services/scrape_service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, any> = {};

    const collegeId = searchParams.get("college");
    if (collegeId) {
      filter.college = collegeId;
    }

    const departmentId = searchParams.get("department");
    if (departmentId) {
      filter.department = departmentId;
    }

    const courses = await getCoursesPage({ page, limit, filter });

    return NextResponse.json(
      {
        message: "Courses fetched successfully",
        data: courses,
        meta: {
          page,
          limit,
          returnedCount: courses.length,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch courses", details: error.message },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;

    const collegeId = searchParams.get("college");
    if (!collegeId) {
      return NextResponse.json(
        { message: 'Missing "college" Param' },
        { status: 400 },
      );
    }

    await syncCourses(collegeId);

    return NextResponse.json(
      { message: "Courses synced successfully." },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to sync courses", details: error.message },
      { status: 500 },
    );
  }
};
