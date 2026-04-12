"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseSchema } from "@/types/db_types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<CourseSchema[]>();
  const [id, setId] = useState("2")
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log(params.then(({ id }) => id));
    params.then(({ id }) => {setId(id)})
    
    fetch(`/api/scrape/courses?colleges=${id}`)
      .then((response) => response.json())
      .then((json) => {
        setData(json.data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  }, []);
  return (<div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(350px,1fr))] p-5">
      {data?.map((value) => (
        <Link href={`/courses/${value._id}`} key={value._id}>
          <Card
            className="h-32 transition-colors hover:bg-muted hover:border-primary"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <CardTitle className="text-2xl">{value.name}</CardTitle>
              <span className="text-muted-foreground text-sm">➔</span>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>);
}
