"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CollegeSchema } from "@/types/db_types";
import Link from "next/link";

import { useEffect, useState } from "react";

export default function page() {
  const [data, setData] = useState<CollegeSchema[]>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("/api/scrape/colleges")
      .then((response) => response.json())
      .then((json) => {
        setData(json.data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  },[]);

  if (isLoading) return <div className="p-6">Loading colleges...</div>;



  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading colleges...</div>;
  }
  return (
    <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(350px,1fr))] p-5">
      {data?.map((value) => (
        <Link href={`/colleges/${value._id}`} key={value._id}>
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
    </div>
  );
}
