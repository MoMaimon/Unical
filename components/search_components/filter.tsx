import { CollegeSchema } from "@/types/db_types";
import { Button } from "../ui/button";
import { ButtonGroup, ButtonGroupText } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface ChildProps {
  filterCollege: string;
  setFilterCollege: Dispatch<SetStateAction<string>>;
}

export default function Filter({
  filterCollege,
  setFilterCollege,
}: ChildProps) {
  const [colleges, setColleges] = useState<CollegeSchema[]>([]);

  useEffect(() => {
    fetch("api/scrape/colleges")
      .then((res) => res.json())
      .then((json) => {
        setColleges(json.data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <ButtonGroup>
      <ButtonGroupText>Filter</ButtonGroupText>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={filterCollege !== "All" ? "default" : "outline"}
            className="capitalize border-0"
          >
            {filterCollege === "All" ? "All Colleges" : filterCollege}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setFilterCollege("All")}>
            All Colleges
          </DropdownMenuItem>
          {colleges.map((college) => (
            <DropdownMenuItem
              key={college._id}
              onClick={() => setFilterCollege(college.name)}
            >
              {college.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
