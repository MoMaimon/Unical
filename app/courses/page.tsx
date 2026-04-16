import ActiveFilters from "@/components/search_components/active-filters";
import Filter from "@/components/search_components/filter";
import Group from "@/components/search_components/group";
import Pages from "@/components/search_components/pagination";
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
import { getColleges } from "@/features/scraping/server/db/repository/college_repository";
import {
  getCoursesPage,
  getTotalPages,
} from "@/features/scraping/server/db/repository/course_repository";
import { getDegrees } from "@/features/scraping/server/db/repository/degree_repository";
import { getDepartments } from "@/features/scraping/server/db/repository/department_repository";
import { getTranslations } from "next-intl/server";

export default async function Courses({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const filter = params.filter;
  const sortBy = params.sort;
  const groupBy = params.group || "none";
  const page = params.page || 1;

  const [degrees, colleges, departments] = await Promise.all([
    getDegrees(),
    getColleges(),
    getDepartments(),
  ]);
  let dbFilter: Record<string, any>;
  if (filter) {
    dbFilter = JSON.parse(Buffer.from(filter, "base64").toString("utf-8"));
  } else {
    dbFilter = {};
  }

  const dbParams = {
    page: Number(page),
    limit: 24,
    filter: dbFilter,
  };
  const courses = await getCoursesPage(dbParams);
  const totalPages = await getTotalPages(dbParams);

  let processed = [...courses];

  if (sortBy === "name") {
    processed.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "hours") {
    processed.sort((a, b) => b.hours - a.hours);
  }

  // C. Group
  let displayData: Record<string, typeof courses> = {};

  if (groupBy === "none") {
    displayData = { "All Courses": processed };
  } else {
    displayData = processed.reduce(
      (acc, course) => {
        // @ts-ignore
        const groupName = course[groupBy].name || "Other";

        if (!acc[groupName]) acc[groupName] = [];
        acc[groupName].push(course);
        return acc;
      },
      {} as Record<string, typeof courses>,
    );
  }

  const t = await getTranslations("Courses")
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-between gap-5">
        <div className="flex justify-between">
          <Filter
            colleges={colleges}
            degrees={degrees}
            departments={departments}
          ></Filter>
          <div className="flex gap-5">
            <Sort />
            <Group />
          </div>
        </div>
        <ActiveFilters
          colleges={colleges}
          degrees={degrees}
          departments={departments}
        />
      </div>
      {courses.length > 0 ? (
        <>
          <Pages totalPages={totalPages} />
          <div className="py-5 space-y-8">
            {Object.entries(displayData).map(([groupName, courses]) => (
              <div key={groupName} className="space-y-4">
                {groupBy !== "none" && (
                  <h2 className="text-2xl font-bold border-b pb-2">
                    {groupName}
                  </h2>
                )}

                <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(max(350px,30%),1fr))]">
                  {courses.map((course) => (
                    <Card key={course._id}>
                      <CardHeader>
                        <CardTitle>{course.name}</CardTitle>
                        <CardDescription>
                          {course.department.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm text-muted-foreground">
                          <li>{course.degree.name}</li>
                          <li>{course.college.name}</li>
                        </ul>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Badge variant="outline">
                          {course.hours} Credit Hours
                        </Badge>
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
      ) : (
        <div className="flex justify-center items-center flex-1 text-5xl font-bold">{t("no_courses_found")}</div>
      )}
    </div>
  );
}
