"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { FilterIcon } from "lucide-react";
import {
  CollegeSchema,
  DegreeSchema,
  DepartmentSchema,
} from "@/types/db_types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import { useEffect, useState } from "react";
import AccordionFilter from "./accordion-filter";
import { useTranslations } from "next-intl";

export default function FilterDrawer({
  degrees,
  colleges,
  departments,
}: {
  degrees: DegreeSchema[];
  colleges: CollegeSchema[];
  departments: DepartmentSchema[];
}) {
  const [collegesFilter, setCollegesFilter] = useState<Set<string>>(new Set());
  const [degreesFilter, setDegreesFilter] = useState<Set<string>>(new Set());
  const [departmentsFilter, setDepartmentsFilter] = useState<Set<string>>(
    new Set(),
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  useEffect(() => {
    // If URL has no filters, clear all checkboxes
    if (!filterParam) {
      setCollegesFilter(new Set());
      setDegreesFilter(new Set());
      setDepartmentsFilter(new Set());
      return;
    }

    // If URL has filters, decode them and check the right boxes
    try {
      const filterObj = JSON.parse(atob(filterParam));
      const andArray = filterObj.$and || [];

      const newColleges = new Set<string>();
      const newDegrees = new Set<string>();
      const newDepartments = new Set<string>();

      andArray.forEach((group: { $or: Record<string, string>[] }) => {
        group.$or.forEach((condition) => {
          if (condition.college) newColleges.add(condition.college);
          if (condition.degree) newDegrees.add(condition.degree);
          if (condition.department) newDepartments.add(condition.department);
        });
      });

      setCollegesFilter(newColleges);
      setDegreesFilter(newDegrees);
      setDepartmentsFilter(newDepartments);
    } catch (e) {
      console.error("Failed to parse filter parameter in drawer");
    }
  }, [filterParam]);

  const activeFilterCount =
    collegesFilter.size + degreesFilter.size + departmentsFilter.size;

  const createFilterObj = () => {
    const andArray: { $or: Record<string, string>[] }[] = [];

    if (collegesFilter.size > 0 && collegesFilter.size < colleges.length) {
      const orArray = Array.from(collegesFilter).map((val) => ({
        college: val,
      }));
      andArray.push({ $or: orArray });
    }

    if (degreesFilter.size > 0 && degreesFilter.size < degrees.length) {
      const orArray = Array.from(degreesFilter).map((val) => ({ degree: val }));
      andArray.push({ $or: orArray });
    }

    if (
      departmentsFilter.size > 0 &&
      departmentsFilter.size < departments.length
    ) {
      const orArray = Array.from(departmentsFilter).map((val) => ({
        department: val,
      }));
      andArray.push({ $or: orArray });
    }

    // Only return the $and object if we actually have filters applied
    return andArray.length > 0 ? { $and: andArray } : {};
  };

  const encode = (obj: Object) => {
    const jsonString = JSON.stringify(obj);
    const base64 = btoa(jsonString);
    return base64;
  };

  const handleFilter = () => {
    const filter = createFilterObj();
    const params = new URLSearchParams(searchParams.toString());

    if (Object.keys(filter).length > 0) {
      params.set("filter", encode(filter));
    } else {
      params.delete("filter");
    }

    router.push(`?${params.toString()}`);
  };

  const t = useTranslations("Courses.Filter");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FilterIcon className="w-4 h-4" />
          {t("filter")}
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs ml-1">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto px-5">
        <SheetHeader>
          <SheetTitle>{t("filter_courses")}</SheetTitle>
        </SheetHeader>

        <div className="py-6 flex flex-col gap-5">
          <AccordionFilter
            colleges={degrees}
            collegesFilter={degreesFilter}
            filterName={t("degrees")}
            setCollegesFilter={setDegreesFilter}
          />
          <AccordionFilter
            colleges={colleges}
            collegesFilter={collegesFilter}
            filterName={t("colleges")}
            setCollegesFilter={setCollegesFilter}
          />
          <AccordionFilter
            colleges={departments}
            collegesFilter={departmentsFilter}
            filterName={t("departments")}
            setCollegesFilter={setDepartmentsFilter}
          />
        </div>
        <SheetFooter className="mt-auto pb-4">
          <SheetClose asChild>
            <Button onClick={handleFilter} className="w-full">
              {t("apply_filters")}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
