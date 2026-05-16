import { ProviderFactory } from "@/features/db/providers/ProviderFactory";
import { NextRequest, NextResponse } from "next/server";

const provider = ProviderFactory.getProvider("BAU");

export const GET = async (req: NextRequest) => {
  try {
    const data = await provider.getColleges();

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
    await provider.syncColleges();

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
