
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCoursesByCollege } from "@/features/scraping/server/db/repository/course_repository";
import Link from "next/link";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
 
  const {id} = await params
  const res = getCoursesByCollege(id)
  const data = await res
  return (<div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(350px,1fr))] p-5">
      {data?.map((value) => (
        <Link href={`/courses/${value._id}`} key={value._id}>
          <Card
            className="h-32 transition-colors hover:bg-muted hover:border-primary"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <CardTitle className="text-2xl">{value.name}</CardTitle>
              <Badge variant={"default"} className="text-md">hours: {value.hours}</Badge>
            </CardHeader>
            <CardContent>
              
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>);
}
