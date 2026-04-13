"use client";

import { usePathname } from "next/navigation";
import { SearchBar } from "./ui/SearchBar";

export function NavbarSearch({ locale }: { locale: string }) {
  const pathname = usePathname();

  // Check if we are on the homepage (either "/" or "/ar" / "/en")
  const isHomePage = pathname === "/" || pathname === `/${locale}`;

  // If it's the homepage, render nothing
  if (isHomePage) return null;

  // Otherwise, render the search bar
  return <SearchBar className="md:max-w-xs lg:max-w-lg 2xl:max-w-2xl" />;
}
