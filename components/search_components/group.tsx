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

export default function () {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGroup = searchParams.get("group") || "none";

  const handleGroup = (groupVal: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (groupVal && groupVal !== "none") {
      params.set("group", groupVal);
    } else {
      params.delete("group");
    }

    router.push(`?${params.toString()}`);
  };
  const t = useTranslations("Courses.GroupBy");
  return (
    <ButtonGroup>
      <ButtonGroupText>{t("group_by")}</ButtonGroupText>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={currentGroup !== "none" ? "default" : "outline"}
            className="capitalize border-0"
          >
            {t(currentGroup)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleGroup("degree")}>
            {t("degree")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleGroup("college")}>
            {t("college")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleGroup("department")}>
            {t("department")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleGroup("none")}
            variant="destructive"
          >
            {t("none")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
