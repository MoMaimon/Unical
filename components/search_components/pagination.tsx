"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "../ui/pagination";
import { generatePagination } from "@/lib/pageination_util";
import { useTranslations } from "next-intl";

interface PagesProps {
  totalPages: number;
}

export default function Pages({ totalPages }: PagesProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  const t = useTranslations("Courses");

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={isFirstPage ? "#" : createPageURL(currentPage - 1)}
            className={isFirstPage ? "pointer-events-none opacity-50" : ""}
            text={t("previous")}
          />
        </PaginationItem>

        {/* 2. Map through the dynamic page array */}
        {allPages.map((page, index) => {
          // Render Ellipsis
          if (page === "...") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          // Render Page Link
          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                href={createPageURL(Number(page))}
                isActive={currentPage === Number(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href={isLastPage ? "#" : createPageURL(currentPage + 1)}
            className={isLastPage ? "pointer-events-none opacity-50" : ""}
            text={t("next")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
