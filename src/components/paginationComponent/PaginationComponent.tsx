import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  totals: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  totals,
  limit,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totals);

  const handlePageClick = (p: number) => {
    if (currentPage !== p) {
      onPageChange(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center justify-center sm:justify-between flex-wrap gap-2 w-full">
      <div className="flex mx-auto justify-center">
        <Pagination>
          <PaginationContent className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
                className={`cursor-pointer ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
            </PaginationItem>

            {pages.map((item) => (
              <PaginationItem key={item}>
                <PaginationLink
                  onClick={() => handlePageClick(item)}
                  isActive={currentPage === item}
                  className={`rounded-full cursor-pointer px-3 py-1 transition-all ${
                    currentPage === item
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageClick(Math.min(totalPages, currentPage + 1))
                }
                className={`cursor-pointer ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="text-lg text-gray-600 dark:text-white whitespace-nowrap">
        Showing{" "}
        <span className="font-medium text-black dark:text-white">{start}</span>–
        <span className="font-medium text-black dark:text-white">{end}</span> of{" "}
        <span className="font-medium text-black dark:text-white">{totals}</span>{" "}
        entries
      </div>
    </div>
  );
};

export default PaginationComponent;
