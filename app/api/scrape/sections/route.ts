import { ProviderFactory } from "@/features/db/providers/ProviderFactory";
import { Query } from "@/features/db/types/ProviderTypes";
import { NextRequest, NextResponse } from "next/server";

const provider = new ProviderFactory();
provider.createBAUProvider();

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const filter = searchParams.get("filter") || undefined;
    const sort = undefined; // TODO

    const query: Query = {
      page: page,
      limit: limit,
      filter: filter,
      sort: sort,
    };

    const sections = await provider.getSections(query);

    return NextResponse.json(
      {
        message: "Sections fetched successfully",
        data: sections,
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
    await provider.syncSections();

    return NextResponse.json(
      { message: "Sections synced successfully." },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to sync sections", details: error.message },
      { status: 500 },
    );
  }
};
