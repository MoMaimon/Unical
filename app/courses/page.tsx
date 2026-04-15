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
import { getColleges } from "@/features/scraping/server/db/repository/college_repository";
import { getCoursesPage } from "@/features/scraping/server/db/repository/course_repository";

export default async function Courses({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const filterCollegeName = params.college;
  const sortBy = params.sort;
  const groupBy = params.group || "none";

  const colleges = await getColleges();

  const dbFilter: Record<string, any> = {};

  if (filterCollegeName) {
    const targetCollege = colleges.find((c) => c.name === filterCollegeName);

    if (targetCollege) {
      dbFilter.college = targetCollege._id;
    }
  }
  const dbParams = {
    page: 1,
    limit: 20,
    filter: dbFilter,
  };
  const courses = await getCoursesPage(dbParams);

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

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-5">
          <Sort />
          <Group />
        </div>
        <Filter colleges={colleges}></Filter>
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
    </div>
  );
}
