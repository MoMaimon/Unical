"use client";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { ButtonGroup, ButtonGroupText } from "../ui/button-group";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
} from "../ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface GroupByProps {
  options: string[];
}

export default function ({ options }: GroupByProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGroup = searchParams.get("group") || "none";

  const handleGroup = useCallback(
    (groupVal: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (groupVal && groupVal !== "none") {
        params.set("group", groupVal);
      } else {
        params.delete("group");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );
  const tCourses = useTranslations("Courses.GroupBy");
  const tCommon = useTranslations();
  return (
    <ButtonGroup>
      <ButtonGroupText>{tCourses("title")}</ButtonGroupText>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={currentGroup !== "none" ? "default" : "outline"}
            className="capitalize border-0"
          >
            {tCourses(currentGroup)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {options.map((option) => (
            <DropdownMenuItem onClick={() => handleGroup(option)} key={option}>
              {option}
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem
            onClick={() => handleGroup("none")}
            variant="destructive"
          >
            {tCourses("none")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
