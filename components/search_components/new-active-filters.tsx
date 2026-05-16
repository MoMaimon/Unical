"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { FilterConfigItem } from "@/lib/filterConfig";
import { useTranslations } from "next-intl";

interface NewActiveFiltersProps {
  filters: FilterConfigItem[];
}

export default function NewActiveFilters({ filters }: NewActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Courses.Filter");

  const activeFilters: { filterId: string; filterLabel: string; optionId: string; optionLabel: string }[] = [];

  filters.forEach((filter) => {
    const values = searchParams.get(filter.id)?.split(",") || [];
    values.forEach((val) => {
      if (val) {
        const option = filter.options?.find((o) => o.id === val);
        activeFilters.push({
          filterId: filter.id,
          filterLabel: filter.label,
          optionId: val,
          optionLabel: option ? option.label : val,
        });
      }
    });
  });

  if (activeFilters.length === 0) return null;

  const removeFilter = (filterId: string, optionId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(filterId)?.split(",") || [];
    const newValues = currentValues.filter((v) => v !== optionId);

    if (newValues.length > 0) {
      params.set(filterId, newValues.join(","));
    } else {
      params.delete(filterId);
    }
    
    // Reset pagination
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    filters.forEach(f => params.delete(f.id));
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-medium text-muted-foreground mr-2">
        {t("active_filters") || "Active Filters"}:
      </span>

      {activeFilters.map(({ filterId, filterLabel, optionId, optionLabel }, index) => (
        <Badge
          key={`${filterId}-${optionId}-${index}`}
          variant="secondary"
          className="px-3 py-1.5 text-sm flex items-center gap-1.5 font-normal rounded-full cursor-pointer bg-secondary/60 hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all duration-200 group"
          onClick={() => removeFilter(filterId, optionId)}
        >
          <span className="text-muted-foreground group-hover:text-destructive/70 capitalize">{filterLabel}:</span>
          <span className="font-semibold">{optionLabel}</span>
          <X className="w-3.5 h-3.5 ml-1 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-destructive transition-colors" />
        </Badge>
      ))}

      <Badge
        variant="ghost"
        className="px-3 py-1.5 text-sm font-medium cursor-pointer hover:bg-destructive/10 text-destructive/70 hover:text-destructive rounded-full transition-all duration-200"
        onClick={clearAll}
      >
        {t("clear_all") || "Clear All"}
      </Badge>
    </div>
  );
}
