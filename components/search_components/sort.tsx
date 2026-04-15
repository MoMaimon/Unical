"use client";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { ButtonGroup, ButtonGroupText } from "../ui/button-group";

interface ChildProps {
  sortBy: "name" | "hours" | null;
  setSortBy: Dispatch<SetStateAction<"name" | "hours" | null>>;
}
export default function Sort({ sortBy, setSortBy }: ChildProps) {
  return (
    <ButtonGroup>
      <ButtonGroupText>Sort</ButtonGroupText>
      <Button
        variant={sortBy === "name" ? "default" : "outline"}
        onClick={() => setSortBy(sortBy === "name" ? null : "name")}
        className="border-0"
      >
        Name
      </Button>
      <Button
        variant={sortBy === "hours" ? "default" : "outline"}
        onClick={() => setSortBy(sortBy === "hours" ? null : "hours")}
        className="border-0"
      >
        Hours
      </Button>
    </ButtonGroup>
  );
}
