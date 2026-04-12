
import { getColleges } from "@/features/scraping/server/db/repository/college_repository";
import { syncColleges } from "@/features/scraping/server/services/scrape_service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const data = await getColleges();

    return NextResponse.json(
      {
        message: "Colleges fetched successfully.",
        data: data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch colleges",
        details: error.message,
      },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await syncColleges();

    return NextResponse.json(
      {
        message: "Colleges synced successfully.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to sync colleges",
        details: error.message,
      },
      { status: 500 },
    );
  }
};
