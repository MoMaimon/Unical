
import { getCollegeFilter, getDepartmentFilter, getSectionsPage } from "@/features/scraping/server/db/repository/section_repository";
import { syncSections } from "@/features/scraping/server/services/scrape_service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, any> = {};

    const collegeId = searchParams.get("college");
    if (collegeId) {
      const coursesIds = await getCollegeFilter(Number(collegeId));
      filter.courseNo = { $in: coursesIds };
    }

    const departmentId = searchParams.get("department");
    if (departmentId) {
      const coursesIds = await getDepartmentFilter(Number(departmentId));
      filter.courseNo = { $in: coursesIds };
      console.log(filter);
    }

    const courseId = searchParams.get("course");
    if (courseId) {
      filter.courseNo = courseId;
    }

    const sections = await getSectionsPage({ page, limit, filter });

    return NextResponse.json(
      {
        message: "Sections fetched successfully",
        data: sections,
        meta: {
          page,
          limit,
          returnedCount: sections.length,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch sections", details: error.message },
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
    if (!Number.isInteger(Number(collegeId))) {
      return NextResponse.json(
        { message: "Invalid College ID" },
        { status: 400 },
      );
    }
    await syncSections(Number(collegeId));
    return NextResponse.json(
      {
        message: "Sections synced successfully.",
      },
      { status: 200 },
    );
  } catch (error) {}
};
