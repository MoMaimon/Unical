"use client";
import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { FormEvent, useState } from "react";

export function SearchBar({ className }: { className: string }) {
  const [searchInput, setSearchInput] = useState("");

  return (
    <InputGroup className={className}>
      <InputGroupInput
        placeholder="Search..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
