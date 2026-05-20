import { ProviderFactory } from "@/features/db/providers/ProviderFactory";
import { NextRequest, NextResponse } from "next/server";

const provider = ProviderFactory.getProvider("BAU");

export const GET = async (req: NextRequest) => {
  try {
    const data = await provider.getDegrees();

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
    await provider.syncDegrees();

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
