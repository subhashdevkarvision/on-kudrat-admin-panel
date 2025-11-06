import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import Select from "../form/Select";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  totals: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  totals,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const limitOptions = [
    {
      label: "5",
      value: "5",
    },
    {
      label: "10",
      value: "10",
    },
    {
      label: "30",
      value: "30",
    },
    {
      label: "50",
      value: "50",
    },
    {
      label: "100",
      value: "100",
    },
  ];

  const handlePageClick = (p: number) => {
    if (currentPage !== p) {
      onPageChange(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleLimitChange = (value: string) => {
    onLimitChange(Number(value));
  };

  return (
    <div className="flex items-center  justify-center xl:justify-between flex-wrap gap-2 w-full">
      <div className="flex  justify-center">
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
        <div className="flex items-center ">
          <span> Showing</span>
          <div className="w-20 mx-1">
            <Select
              options={limitOptions}
              placeholder="Rows per page"
              onChange={handleLimitChange}
              defaultValue={String(limit)}
            />
          </div>
          <span>out of</span>
          <span className="font-medium text-black mx-1 dark:text-white">
            {totals}
          </span>
          <span> entries</span>
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;
