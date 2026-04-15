"use client";
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
  return (
    <ButtonGroup>
      <ButtonGroupText>Group By</ButtonGroupText>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={currentGroup !== "none" ? "default" : "outline"}
            className="capitalize border-0"
          >
            {currentGroup}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleGroup("degree")}>
            Degree
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleGroup("college")}>
            {" "}
            College
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleGroup("department")}>
            Department
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleGroup("none")}
            variant="destructive"
          >
            None
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
