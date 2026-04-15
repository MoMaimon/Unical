"use client";
import { CollegeSchema } from "@/types/db_types";
import { Button } from "../ui/button";
import { ButtonGroup, ButtonGroupText } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterProps {
  colleges: CollegeSchema[];
}

export default function Filter({ colleges }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCollege = searchParams.get("college");

  const handleSelect = (collegeName: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (collegeName) {
      params.set("college", collegeName);
    } else {
      params.delete("college");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <ButtonGroup>
      <ButtonGroupText>Filter</ButtonGroupText>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={currentCollege !== "All" ? "default" : "outline"}
            className="capitalize border-0"
          >
            {currentCollege || "All Colleges"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleSelect(null)}>
            All Colleges
          </DropdownMenuItem>
          {colleges.map((college) => (
            <DropdownMenuItem
              key={college._id}
              onClick={() => handleSelect(college.name)}
            >
              {college.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
