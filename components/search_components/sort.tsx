"use client";

import { Button } from "../ui/button";
import { ButtonGroup, ButtonGroupText } from "../ui/button-group";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

interface SortProps {
  options: string[];
}
export default function Sort({ options }: SortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort");

 const handleSort = useCallback((sortVal: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sortVal) {
      params.set("sort", sortVal);
    } else {
      params.delete("sort");
    }
    
    // scroll: false prevents the page from snapping to the top
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const t = useTranslations("Courses.Sort");
  return (
    <ButtonGroup>
      <ButtonGroupText>{t("title")}</ButtonGroupText>
      {options.map((option) => (
        <Button
          variant={currentSort === option ? "default" : "outline"}
          onClick={() => handleSort(currentSort === option ? null : option)}
          className="border-0"
          key={option}
        >
          {t(option)}
        </Button>
      ))}
    </ButtonGroup>
  );
}
