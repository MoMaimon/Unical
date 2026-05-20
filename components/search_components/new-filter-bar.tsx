"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FilterConfigItem } from "@/lib/filterConfig";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown, FilterIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface NewFilterBarProps {
  filters: FilterConfigItem[];
}

export default function NewFilterBar({ filters }: NewFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tCourses = useTranslations("Courses");
  const tCommon = useTranslations();
  const handleSelect = (
    filterId: string,
    optionId: string,
    checked: boolean,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(filterId)?.split(",") || [];

    let newValues: string[];
    if (checked) {
      newValues = [...currentValues, optionId];
    } else {
      newValues = currentValues.filter((v) => v !== optionId);
    }

    if (newValues.length > 0) {
      params.set(filterId, newValues.join(","));
    } else {
      params.delete(filterId);
    }

    // Reset pagination to page 1 on filter change
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 mr-2 text-sm font-semibold text-muted-foreground">
        <FilterIcon className="w-4 h-4" />
        {tCourses("Filter.title")}
      </div>
      {filters.map((filter) => {
        const currentSelected = searchParams.get(filter.id)?.split(",") || [];
        const activeCount = currentSelected.length;

        return (
          <DropdownMenu key={filter.id}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-3 rounded-full bg-background hover:bg-muted/50 border border-border/50 text-foreground transition-all duration-200 gap-2"
              >
                {tCommon(`Entities.${filter.label}`, { count: -1 })}
                {activeCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full leading-none">
                    {activeCount}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 p-2 space-y-1 shadow-xl rounded-2xl border border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                {tCourses("Filter.options", {
                  data: tCommon(`Entities.${filter.label}`, { count: -1 }),
                })}
              </div>
              <div className="max-h-64 overflow-y-auto pr-1">
                {filter.options?.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.id}
                    checked={currentSelected.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleSelect(filter.id, option.id, checked)
                    }
                    className="rounded-lg cursor-pointer"
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
                {(!filter.options || filter.options.length === 0) && (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No options
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
}
