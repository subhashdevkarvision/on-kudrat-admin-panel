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
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageClick = (p: number) => {
    if (currentPage !== p) {
      onPageChange(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Pagination className="flex flex-wrap justify-center gap-2 sm:gap-4">
      <PaginationContent className="space-x-3">
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
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
