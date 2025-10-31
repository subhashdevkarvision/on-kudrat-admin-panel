import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "../lib/utils";
import Button from "./button/Button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

function PaginationLink({ isActive, onClick, children }: PaginationLinkProps) {
  return (
    <Button
      size="icon"
      variant={isActive ? "outline" : "primary"}
      className={cn(
        "w-9 h-9 rounded-full",
        isActive && "ring-2 ring-brand-500"
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function PaginationPrevious({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-1"
    >
      <ChevronLeftIcon size={18} />
      <span className="hidden sm:block">Previous</span>
    </Button>
  );
}

function PaginationNext({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-1"
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon size={18} />
    </Button>
  );
}

function PaginationEllipsis() {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className="flex size-9 items-center justify-center"
    >
      <MoreHorizontalIcon className="size-4 text-gray-400" />
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
