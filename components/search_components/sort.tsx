"use client";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { ButtonGroup, ButtonGroupText } from "../ui/button-group";
import { useRouter, useSearchParams } from "next/navigation";

export default function Sort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort");

  const handleSort = (sortVal: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sortVal) {
      params.set("sort", sortVal);
    } else {
      params.delete("sort");
    }
    router.push(`?${params.toString()}`);
  };
  return (
    <ButtonGroup>
      <ButtonGroupText>Sort</ButtonGroupText>
      <Button
        variant={currentSort === "name" ? "default" : "outline"}
        onClick={() => handleSort(currentSort === "name" ? null : "name")}
        className="border-0"
      >
        Name
      </Button>
      <Button
        variant={currentSort === "hours" ? "default" : "outline"}
        onClick={() => handleSort(currentSort === "hours" ? null : "hours")}
        className="border-0"
      >
        Hours
      </Button>
    </ButtonGroup>
  );
}
