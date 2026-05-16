import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ProviderFactory } from "@/features/db/providers/ProviderFactory";
import Link from "next/link";

import { Suspense } from "react";

async function CollegeList() {
  const provider = new ProviderFactory();
  provider.createBAUProvider();
  const data = await provider.getColleges();

  if (!data || data.length === 0) {
    return <p className="p-5 text-muted-foreground">No colleges found. Please add some data to your database.</p>;
  }

  return (
    <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(350px,1fr))] p-5">
      {data.map((value) => (
        <Link href={`/colleges/${value.id}`} key={value.id}>
          <Card className="h-32 transition-colors hover:bg-muted hover:border-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <CardTitle className="text-2xl">{value.englishName}</CardTitle>
              <span className="text-muted-foreground text-sm">➔</span>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p className="p-5">Loading colleges...</p>}>
      <CollegeList />
    </Suspense>
  );
}
