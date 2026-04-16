"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { FieldSet, FieldGroup, Field, FieldLabel } from "../ui/field";
import { Checkbox } from "../ui/checkbox";
import { CollegeSchema } from "@/types/db_types";
import { Dispatch, SetStateAction } from "react";

interface AccordionFilterProp {
  filterName: string;
  colleges: CollegeSchema[];
  collegesFilter: Set<string>;
  setCollegesFilter: Dispatch<SetStateAction<Set<string>>>;
}
export default function AccordionFilter({
  filterName,
  colleges,
  collegesFilter,
  setCollegesFilter,
}: AccordionFilterProp) {
  const selectAll = collegesFilter.size === colleges.length;
  const handleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(collegesFilter);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setCollegesFilter(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setCollegesFilter(new Set(colleges.map((college) => `${college._id}`)));
    } else {
      setCollegesFilter(new Set());
    }
  };
  return (
    <Accordion type="multiple">
      <AccordionItem value="college" className="border-b-0">
        <AccordionTrigger className="text-base font-semibold hover:no-underline capitalize">
          {filterName}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-1 mt-2 h-fit">
          <FieldSet>
            <FieldGroup className="gap-3">
              <Field orientation="horizontal">
                <Checkbox
                  id="select-all-checkbox"
                  name="select-all-checkbox"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <FieldLabel
                  htmlFor="select-all-checkbox"
                  className="font-normal"
                >
                  Select All
                </FieldLabel>
              </Field>
              {colleges.map((c) => (
                <Field key={c._id} orientation="horizontal">
                  <Checkbox
                    id={`${c._id}`}
                    name={`${c._id}`}
                    checked={collegesFilter.has(`${c._id}`)}
                    onCheckedChange={(checked) =>
                      handleSelect(`${c._id}`, checked === true)
                    }
                  />
                  <FieldLabel htmlFor={`${c._id}`} className="font-normal">
                    {c.name}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
