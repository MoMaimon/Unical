"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import {
  CollegeSchema,
  DegreeSchema,
  DepartmentSchema,
} from "@/types/db_types";

interface ActiveFiltersProps {
  colleges: CollegeSchema[];
  degrees: DegreeSchema[];
  departments: DepartmentSchema[];
}

// Define the shape of our nested DB query
type FilterCondition = Record<string, string>;
type OrGroup = { $or: FilterCondition[] };
type DbFilter = { $and?: OrGroup[] };

export default function ActiveFilters({
  colleges,
  degrees,
  departments,
}: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  if (!filterParam) return null;

  let filterObj: DbFilter = {};
  try {
    filterObj = JSON.parse(atob(filterParam));
  } catch (e) {
    return null;
  }

  const andArray = filterObj.$and || [];
  if (andArray.length === 0) return null;

  const activeBadges: { key: string; val: string }[] = [];
  andArray.forEach((group) => {
    group.$or.forEach((condition) => {
      const key = Object.keys(condition)[0];
      activeBadges.push({ key, val: condition[key] });
    });
  });

  const removeFilter = (keyToRemove: string, valueToRemove: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const newAndArray = andArray
      .map((group) => {
        return {
          $or: group.$or.filter((cond) => {
            const k = Object.keys(cond)[0];
            
            return !(k === keyToRemove && cond[k] === valueToRemove);
          }),
        };
      })
      .filter((group) => group.$or.length > 0); // 2. Remove any $or groups that are now empty

    // 3. Update the URL
    if (newAndArray.length > 0) {
      const base64 = btoa(JSON.stringify({ $and: newAndArray }));
      params.set("filter", base64);
    } else {
      params.delete("filter");
    }

    router.push(`?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("filter");
    router.push(`?${params.toString()}`);
  };

  const getDisplayName = (key: string, id: string) => {
    if (key === "college")
      return colleges.find((c) => `${c._id}` === id)?.name || id;
    if (key === "degree")
      return degrees.find((d) => `${d._id}` === id)?.name || id;
    if (key === "department")
      return departments.find((d) => `${d._id}` === id)?.name || id;
    return id;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-medium text-muted-foreground mr-2">
        Active Filters:
      </span>

      {activeBadges.map(({ key, val }, index) => (
        <Badge
          key={`${key}-${val}-${index}`}
          variant="secondary"
          // 1. Added cursor-pointer, group, and hover effects here
          className="px-3 py-1 text-sm flex items-center gap-1 font-normal rounded-full capitalize cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors group"
          // 2. Moved the onClick here so the whole badge is clickable
          onClick={() => removeFilter(key, val)}
        >
          {key}:{" "}
          <span className="font-semibold">{getDisplayName(key, val)}</span>
          <X
            // 3. Removed onClick from the X, and updated text color to react to the group hover
            className="w-3 h-3 ml-1 text-muted-foreground group-hover:text-destructive transition-colors"
          />
        </Badge>
      ))}

      <Badge
        variant="ghost"
        className="px-3 py-1 text-sm cursor-pointer hover:bg-destructive/10 hover:text-destructive rounded-full"
        onClick={clearAll}
      >
        Clear All
      </Badge>
    </div>
  );
}
