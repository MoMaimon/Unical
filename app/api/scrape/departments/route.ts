import { ProviderFactory } from "@/features/db/providers/ProviderFactory";
import { NextRequest, NextResponse } from "next/server";

const provider = new ProviderFactory();
provider.createBAUProvider();

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;

    const collegeId = searchParams.get("college") || undefined;

    const data = await provider.getDepartments(collegeId);
    return NextResponse.json(
      {
        message: "Departments fetched successfully",
        data: data,
      },
      { status: 200 },
    );
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
    await provider.syncDepartments();
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
