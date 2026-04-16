import CourseList from "@/components/course-list";
import ActiveFilters from "@/components/search_components/active-filters";
import Filter from "@/components/search_components/filter";
import Group from "@/components/search_components/group";
import Sort from "@/components/search_components/sort";
import { getColleges } from "@/features/scraping/server/db/repository/college_repository";
import { getDegrees } from "@/features/scraping/server/db/repository/degree_repository";
import { getDepartments } from "@/features/scraping/server/db/repository/department_repository";
import { Suspense } from "react";

function CourseListSkeleton() {
  return (
    <div className="py-20 flex flex-col items-center justify-center space-y-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground font-medium animate-pulse">
        Loading courses...
      </p>
    </div>
  );
}

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

  let dbFilter: Record<string, any> = {};
  if (filter) {
    try {
      dbFilter = JSON.parse(Buffer.from(filter, "base64").toString("utf-8"));
    } catch (e) {
      console.error("Failed to parse filter URL parameter");
    }
  }

  const dbParams = {
    page: Number(page),
    limit: 24,
    filter: dbFilter,
  };

  const suspenseKey = JSON.stringify(params);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-between gap-5 mb-5">
        <div className="flex justify-between">
          <Filter
            colleges={colleges}
            degrees={degrees}
            departments={departments}
          />
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

      <Suspense key={suspenseKey} fallback={<CourseListSkeleton />}>
        <CourseList dbParams={dbParams} sortBy={sortBy} groupBy={groupBy} />
      </Suspense>
    </div>
  );
}
