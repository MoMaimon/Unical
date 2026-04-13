"use client";
import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function SearchBar({ className }: { className: string }) {
  const [searchInput, setSearchInput] = useState("");
  const t = useTranslations("NavBar")
  return (
    <InputGroup className={className}>
      <InputGroupInput
        placeholder={`${t("search")}...`}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
