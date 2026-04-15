"use client";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { ButtonGroup, ButtonGroupText } from "../ui/button-group";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
} from "../ui/dropdown-menu";

interface ChildProps {
  groupBy: "none" | "degree" | "college" | "department";
  setGroupBy: Dispatch<
    SetStateAction<"none" | "degree" | "college" | "department">
  >;
}

export default function ({ groupBy, setGroupBy }: ChildProps) {
  return (
    <ButtonGroup>
      <ButtonGroupText>Group By</ButtonGroupText>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={groupBy !== "none" ? "default" : "outline"}
            className="capitalize border-0"
          >
            {groupBy}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setGroupBy("degree")}>
            Degree
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setGroupBy("college")}>
            {" "}
            College
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setGroupBy("department")}>
            Department
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setGroupBy("none")}
            variant="destructive"
          >
            None
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
