import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "../lib/utils";

// Pagination container
export const Pagination: React.FC<React.ComponentProps<"nav">> = ({
  className,
  ...props
}) => (
  <nav
    role="navigation"
    aria-label="pagination"
    data-slot="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);

// Pagination content
export const PaginationContent: React.FC<React.ComponentProps<"ul">> = ({
  className,
  ...props
}) => (
  <ul
    data-slot="pagination-content"
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
);

// Pagination item
export const PaginationItem: React.FC<React.ComponentProps<"li">> = (props) => (
  <li data-slot="pagination-item" {...props} />
);

// Pagination link
interface PaginationLinkProps {
  isActive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const PaginationLink: React.FC<PaginationLinkProps> = ({
  isActive,
  onClick,
  children,
  className,
}) => {
  return (
    <button
      className={cn(
        "w-9 h-9 rounded-full",
        isActive && "ring-2 ring-brand-500",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Pagination previous
interface PaginationButtonProps {
  onClick?: () => void;
  className?: string;
}

export const PaginationPrevious: React.FC<PaginationButtonProps> = ({
  onClick,
  className,
}) => (
  <button onClick={onClick} className={`flex items-center gap-1 ${className}`}>
    <ChevronLeftIcon size={18} />
    <span className="hidden sm:block">Previous</span>
  </button>
);

// Pagination next
export const PaginationNext: React.FC<PaginationButtonProps> = ({
  onClick,
  className,
}) => (
  <button onClick={onClick} className={`flex items-center gap-1 ${className}`}>
    <span className="hidden sm:block">Next</span>
    <ChevronRightIcon size={18} />
  </button>
);

// Pagination ellipsis
export const PaginationEllipsis: React.FC = () => (
  <span
    aria-hidden
    data-slot="pagination-ellipsis"
    className="flex size-9 items-center justify-center"
  >
    <MoreHorizontalIcon className="size-4 text-gray-400" />
  </span>
);
