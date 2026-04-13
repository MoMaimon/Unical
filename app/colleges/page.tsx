import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getColleges } from "@/features/scraping/server/db/repository/college_repository";
import Link from "next/link";

export default async function page() {
  const res = getColleges();
  const data = await res;
  
  return (
    <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(350px,1fr))] p-5">
      {data?.map((value) => (
        <Link href={`/colleges/${value._id}`} key={value._id}>
          <Card className="h-32 transition-colors hover:bg-muted hover:border-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <CardTitle className="text-2xl">{value.name}</CardTitle>
              <span className="text-muted-foreground text-sm">➔</span>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
