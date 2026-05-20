"use client";
import { BookOpen, Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { logger } from "@/lib/utils/logger";
import Link from "next/link";
import { SearchCourse } from "@/types/Data";

export function SearchBar({ className }: { className: string }) {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    const abortController = new AbortController();

    const delayDebounceFn = setTimeout(async () => {
      if (searchInput.trim().length > 2) {
        setIsSearching(true);
        try {
          const res = await fetch(
            `/api/search/courses?q=${encodeURIComponent(searchInput)}`,
            {
              signal: abortController.signal,
            },
          );

          if (!res.ok) throw new Error("Network response was not ok");

          const data = await res.json();
          setResults(data);
          setHasSearched(true);
        } catch (error: any) {
          if (error.name !== "AbortError") {
            logger.error("Search failed:", error);
          }
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 1000);

    return () => {
      clearTimeout(delayDebounceFn);
      abortController.abort();
    };
  }, [searchInput]);

  return (
    <div
      className={`relative w-full max-w-2xl ${className}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <InputGroup>
        <InputGroupInput
          placeholder={`${t("Actions.search")}...`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <InputGroupAddon>
          {isSearching ? (
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
          ) : (
            <Search />
          )}
        </InputGroupAddon>
      </InputGroup>

      {(results.length > 0 || (hasSearched && searchInput.length > 2)) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col">
          <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300">
            {results.length > 0 ? (
              results.map((course: SearchCourse) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <div className="group flex flex-col p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {course.englishName}
                      </p>
                      <span className="shrink-0 ml-4 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                        {course.courseCode}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1.5 gap-2">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {course.creditHours} Credits
                      </span>
                      <span className="text-gray-400">•</span>
                      <span dir="rtl">{course.arabicName}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500">
                <Search className="h-8 w-8 text-gray-300 mb-3" />
                <p className="font-medium text-gray-900">No courses found</p>
                <p className="text-sm mt-1">
                  We couldn't find anything matching "{searchInput}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
