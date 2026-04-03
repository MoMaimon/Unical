import { getAllDegrees, syncDegrees } from "@/lib/Scraping/scrape_service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const data = await getAllDegrees();

    return NextResponse.json(
      {
        message: "Degrees fetched successfully.",
        data: data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch degrees",
        details: error.message,
      },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await syncDegrees();

    return NextResponse.json(
      {
        message: "Degrees synced successfully.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to sync degrees",
        details: error.message,
      },
      { status: 500 },
    );
  }
};
