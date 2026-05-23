import CourseList from "@/components/course-list";
import NewActiveFilters from "@/components/search_components/new-active-filters";
import NewFilterBar from "@/components/search_components/new-filter-bar";
import Group from "@/components/search_components/group";
import Sort from "@/components/search_components/sort";
import { ProviderFactory } from "@/features/db/providers/ProviderFactory";
import { Suspense } from "react";
import { filterConfig, getPopulatedFilters } from "@/lib/filterConfig";
import { logger } from "@/lib/utils/logger";

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
  const provider = ProviderFactory.getProvider("BAU");

  const params = await searchParams;

  const sortBy = params.sort;
  const groupBy = params.group || "none";
  const page = params.page || 1;

  const [degrees, colleges, departments] = await Promise.all([
    provider.getDegrees(),
    provider.getColleges(),
    provider.getDepartments(),
  ]);

  const populatedFilters = await getPopulatedFilters(degrees, colleges, departments);

  const filterConditions: string[] = [];
  filterConfig.forEach((filter) => {
    const value = params[filter.id];
    if (value) {
      const valuesArray = value.split(",").map((v) => `'${v}'`);
      filterConditions.push(`(${filter.id} in [${valuesArray.join(", ")}])`);
    }
  });

  const dbFilterString =
    filterConditions.length > 0 ? filterConditions.join(" AND ") : undefined;

  logger.info(dbFilterString);
  const dbParams = {
    page: Number(page),
    limit: 24,
    filter: dbFilterString,
  };

  const suspenseKey = JSON.stringify(params);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-between gap-5 mb-5">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <NewFilterBar filters={populatedFilters} />
          <div className="flex gap-3">
            <Suspense
              fallback={
                <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
              }
            >
              <Sort options={["name", "hours"]} />
              <Group options={["degree", "college", "department"]} />
            </Suspense>
          </div>
        </div>
        <NewActiveFilters filters={populatedFilters} />
      </div>

      <Suspense key={suspenseKey} fallback={<CourseListSkeleton />}>
        <CourseList dbParams={dbParams} sortBy={sortBy} groupBy={groupBy} />
      </Suspense>
    </div>
  );
}
