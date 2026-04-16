import {
  getCoursesPage,
  getTotalPages,
} from "@/features/scraping/server/db/repository/course_repository";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Pages from "./search_components/pagination";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default async function CourseList({
  dbParams,
  sortBy,
  groupBy,
}: {
  dbParams: { page: number; limit: number; filter: Record<string, any> };
  sortBy: string | undefined;
  groupBy: string;
}) {
  const courses = await getCoursesPage(dbParams);
  const totalPages = await getTotalPages(dbParams);
  const t = await getTranslations("Courses");

  let processed = [...courses];

  if (sortBy === "name") {
    processed.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "hours") {
    processed.sort((a, b) => b.hours - a.hours);
  }

  let displayData: Record<string, typeof courses> = {};

  type GroupableKey = "degree" | "college" | "department";
  const isValidGroup = (key: string): key is GroupableKey =>
    ["degree", "college", "department"].includes(key);

  if (groupBy === "none" || !isValidGroup(groupBy)) {
    displayData = { "All Courses": processed };
  } else {
    displayData = processed.reduce(
      (acc, course) => {
        const groupName = course[groupBy]?.name || "Other";
        if (!acc[groupName]) acc[groupName] = [];
        acc[groupName].push(course);
        return acc;
      },
      {} as Record<string, typeof courses>,
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex justify-center items-center flex-1 text-4xl md:text-5xl font-bold py-20 text-muted-foreground text-center">
        {t("no_courses_found")}
      </div>
    );
  }

  return (
    <>
      <Pages totalPages={totalPages} />
      <div className="py-5 space-y-8">
        {Object.entries(displayData).map(([groupName, groupCourses]) => (
          <div key={groupName} className="space-y-4">
            {groupBy !== "none" && (
              <h2 className="text-2xl font-bold border-b pb-2">{groupName}</h2>
            )}

            <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(max(350px,30%),1fr))]">
              {groupCourses.map((course) => (
                <Card key={course._id}>
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>{course.department.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground">
                      <li>{course.degree.name}</li>
                      <li>{course.college.name}</li>
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
      <Pages totalPages={totalPages} />
    </>
  );
}
