"use client";
import Filter from "@/components/search_components/filter";
import Group from "@/components/search_components/group";
import Sort from "@/components/search_components/sort";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CourseSchema } from "@/types/db_types";

import { useEffect, useMemo, useState } from "react";



export default function Courses() {
  const [filterCollege, setFilterCollege] = useState<string>("All");
  const [sortBy, setSortBy] = useState<null | "name" | "hours">(null);
  const [groupBy, setGroupBy] = useState<
    "none" | "degree" | "college" | "department"
  >("none");

  const [courses, setCourses] = useState<CourseSchema[]>([]);

  useEffect(() => {
    fetch(`api/scrape/courses`)
      .then((res) => res.json())
      .then((json) => {
        setCourses(json.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [filterCollege]);

  const displayData = useMemo(() => {
    let processed = [...courses];
    if (sortBy === "name") {
      processed.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "hours") {
      processed.sort((a, b) => b.hours - a.hours);
    }

    if (groupBy === "none") {
      return { "All Courses": processed };
    }

    return processed.reduce(
      (acc, course) => {
        const groupName = course[groupBy];
        if (!acc[groupName]) {
          acc[groupName] = [];
        }
        acc[groupName].push(course);
        return acc;
      },
      {} as Record<string, typeof courses>,
    );
  }, [sortBy, groupBy]);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-5">
          <Sort sortBy={sortBy} setSortBy={setSortBy}></Sort>
          <Group groupBy={groupBy} setGroupBy={setGroupBy}></Group>
        </div>
        <Filter
          filterCollege={filterCollege}
          setFilterCollege={setFilterCollege}
        ></Filter>
      </div>
      <div className="py-5 space-y-8">
        {Object.entries(displayData).map(([groupName, courses]) => (
          <div key={groupName} className="space-y-4">
            {groupBy !== "none" && (
              <h2 className="text-2xl font-bold border-b pb-2">{groupName}</h2>
            )}

            <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(max(350px,30%),1fr))]">
              {courses.map((course) => (
                <Card key={course._id}>
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>{course.department}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground">
                      <li>{course.degree}</li>
                      <li>{course.college}</li>
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Badge variant="outline">{course.hours} Credit Hours</Badge>
                    <Button>View Sections</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
