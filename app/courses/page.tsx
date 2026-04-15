"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemo, useState } from "react";

const MOCK_COURSES = [
  // Information Technology - Computer Science
  {
    _id: "35005101",
    name: "Introduction to Computer Science",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 10, name: "Information Technology" },
    department: { _id: 101, name: "Computer Science" },
    hours: 3,
  },
  {
    _id: "35005102",
    name: "Data Structures",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 10, name: "Information Technology" },
    department: { _id: 101, name: "Computer Science" },
    hours: 3,
  },
  {
    _id: "35005103",
    name: "Algorithms and Complexity",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 10, name: "Information Technology" },
    department: { _id: 101, name: "Computer Science" },
    hours: 3,
  },
  {
    _id: "35005104",
    name: "Artificial Intelligence",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 10, name: "Information Technology" },
    department: { _id: 101, name: "Computer Science" },
    hours: 3,
  },
  {
    _id: "35005105",
    name: "Advanced Machine Learning",
    degree: { _id: 2, name: "Master" }, // Master's degree course
    college: { _id: 10, name: "Information Technology" },
    department: { _id: 101, name: "Computer Science" },
    hours: 3,
  },

  // Information Technology - Software Engineering
  {
    _id: "35006101",
    name: "Web Application Development",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 10, name: "Information Technology" },
    department: { _id: 104, name: "Software Engineering" },
    hours: 3,
  },
  {
    _id: "35006102",
    name: "Software Requirements and Design",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 10, name: "Information Technology" },
    department: { _id: 104, name: "Software Engineering" },
    hours: 3,
  },
  {
    _id: "35006103",
    name: "Database Management Systems",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 10, name: "Information Technology" },
    department: { _id: 104, name: "Software Engineering" },
    hours: 3,
  },

  // Science - Mathematics
  {
    _id: "35004101",
    name: "Calculus I",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 11, name: "Science" },
    department: { _id: 102, name: "Mathematics" },
    hours: 3,
  },
  {
    _id: "35004102",
    name: "Calculus II",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 11, name: "Science" },
    department: { _id: 102, name: "Mathematics" },
    hours: 3,
  },
  {
    _id: "35004103",
    name: "Linear Algebra",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 11, name: "Science" },
    department: { _id: 102, name: "Mathematics" },
    hours: 3,
  },

  // Science - Physics
  {
    _id: "35003101",
    name: "General Physics 101",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 11, name: "Science" },
    department: { _id: 103, name: "Physics" },
    hours: 4, // 4 credit hours (usually includes a lab)
  },
  {
    _id: "35003102",
    name: "Quantum Mechanics",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 11, name: "Science" },
    department: { _id: 103, name: "Physics" },
    hours: 3,
  },

  // Engineering - Civil Engineering
  {
    _id: "35007101",
    name: "Structural Analysis I",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 12, name: "Engineering" },
    department: { _id: 108, name: "Civil Engineering" },
    hours: 3,
  },
  {
    _id: "35007102",
    name: "Fluid Mechanics",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 12, name: "Engineering" },
    department: { _id: 108, name: "Civil Engineering" },
    hours: 3,
  },

  // Business - Accounting & Management
  {
    _id: "35008101",
    name: "Principles of Accounting I",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 13, name: "Business" },
    department: { _id: 105, name: "Accounting" },
    hours: 3,
  },
  {
    _id: "35009101",
    name: "Microeconomics",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 13, name: "Business" },
    department: { _id: 106, name: "Management" },
    hours: 3,
  },
  {
    _id: "35009102",
    name: "Marketing Fundamentals",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 13, name: "Business" },
    department: { _id: 106, name: "Management" },
    hours: 3,
  },

  // Arts - English Language
  {
    _id: "35010101",
    name: "English Composition",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 14, name: "Arts" },
    department: { _id: 107, name: "English" },
    hours: 3,
  },
  {
    _id: "35010102",
    name: "Introduction to World Literature",
    degree: { _id: 1, name: "Bachelor" },
    college: { _id: 14, name: "Arts" },
    department: { _id: 107, name: "English" },
    hours: 3,
  },
];
export default function Courses() {
  const [sortBy, setSortBy] = useState<null | "name" | "hours">();
  const [groupBy, setGroupBy] = useState<
    "none" | "degree" | "college" | "department"
  >("none");

  const displayData = useMemo(() => {
    let processed = [...MOCK_COURSES];
    if (sortBy === "name") {
      processed.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "hours") {
      processed.sort((a, b) => b.hours - a.hours);
    }

    if (groupBy === "none") {
      return { "All Courses": processed };
    }

    return processed.reduce(
      (acc, course) => {
        const groupName = course[groupBy].name;
        if (!acc[groupName]) {
          acc[groupName] = [];
        }
        acc[groupName].push(course);
        return acc;
      },
      {} as Record<string, typeof MOCK_COURSES>,
    );
  }, [sortBy, groupBy]);

  return (
    <div>
      <div className="flex gap-5">
        <ButtonGroup>
          <ButtonGroupText>Sort</ButtonGroupText>
          <Button
            variant={sortBy === "name" ? "default" : "outline"}
            onClick={() => setSortBy(sortBy === "name" ? null : "name")}
          >
            Name
          </Button>
          <Button
            variant={sortBy === "hours" ? "default" : "outline"}
            onClick={() => setSortBy(sortBy === "hours" ? null : "hours")}
          >
            Hours
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <ButtonGroupText>Group By</ButtonGroupText>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="capitalize">
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
      </div>
      <div className="py-5 space-y-8">
        {Object.entries(displayData).map(([groupName, courses]) => (
          <div key={groupName} className="space-y-4">
            {/* Only show the group header if we are actually grouping */}
            {groupBy !== "none" && (
              <h2 className="text-2xl font-bold border-b pb-2">{groupName}</h2>
            )}

            <div className="grid gap-5 grid-cols-[repeat(auto-fit,max(350px,30%))]">
              {courses.map((course) => (
                <Card key={course._id}>
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>{course.department.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground">
                      <li>{course.degree.name}</li>
                      <li>{course.college.name}</li>
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Badge variant="outline">{course.hours} Credit Hours</Badge>
                    <Button>View Sections</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
