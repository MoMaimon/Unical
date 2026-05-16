import { getLocale, getTranslations } from "next-intl/server";
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
import { ProviderFactory } from "@/features/db/providers/ProviderFactory";

export default async function CourseList({
  dbParams,
  sortBy,
  groupBy,
}: {
  dbParams: { page: number; limit: number; filter?: string };
  sortBy: string | undefined;
  groupBy: string;
}) {
  const provider = new ProviderFactory();
  provider.createBAUProvider();

  const locale = await getLocale();

  const nameField = locale === "ar" ? "arabicName" : "englishName";

  const result = await provider.getCourses({
    page: dbParams.page,
    limit: dbParams.limit,
    filter: dbParams.filter,
    sort:
      sortBy === "name"
        ? [{ field: nameField, direction: "asc" }]
        : sortBy === "hours"
          ? [{ field: "creditHours", direction: "desc" }]
          : undefined,
  });

  const courses = result.data;
  const totalPages = result.totalPages;
  const t = await getTranslations("Courses");

  let displayData: Record<string, typeof courses> = {};

  type GroupableKey = "degree" | "college" | "department";
  const isValidGroup = (key: string): key is GroupableKey =>
    ["degree", "college", "department"].includes(key);

  if (groupBy === "none" || !isValidGroup(groupBy)) {
    displayData = { "All Courses": courses };
  } else {
    displayData = courses.reduce(
      (acc, course) => {
        const groupName = course[groupBy]?.[nameField] || "Other";
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
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle>{course[nameField]}</CardTitle>
                    <CardDescription>
                      {(course as any).department?.englishName ||
                        (course as any).department?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground">
                      <li>
                        {(course as any).degree?.englishName ||
                          (course as any).degree?.name}
                      </li>
                      <li>{course.department?.college?.[nameField]}</li>
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Badge variant="outline">
                      {course.creditHours} Credit Hours
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
  );
}
