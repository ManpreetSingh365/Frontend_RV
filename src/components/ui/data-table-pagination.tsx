"use client";

import * as React from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
}

export function DataTablePagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [1, 2, 10, 25, 50, 100],
}: DataTablePaginationProps) {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-3 sm:py-4 border-t bg-background/50">
            {/* Left Side: Rows per page and Info */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        Rows per page
                    </p>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(value) => {
                            onPageSizeChange(Number(value));
                            onPageChange(1); // Reset to first page when changing page size
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px] sm:h-9 text-sm shadow-sm hover:shadow-md transition-shadow border-border/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                    Showing <span className="text-foreground font-semibold">{startItem}</span>-
                    <span className="text-foreground font-semibold">{endItem}</span> of{" "}
                    <span className="text-foreground font-semibold">{totalItems}</span>
                </div>
            </div>

            {/* Right Side: Pagination Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
                {/* First & Previous */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden sm:flex h-8 w-8 sm:h-9 sm:w-9 shadow-sm hover:shadow-md hover:bg-accent transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        onClick={() => onPageChange(1)}
                        disabled={!canGoPrevious}
                        aria-label="Go to first page"
                    >
                        <DoubleArrowLeftIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9 shadow-sm hover:shadow-md hover:bg-accent transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!canGoPrevious}
                        aria-label="Go to previous page"
                    >
                        <ChevronLeftIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                </div>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {renderPageNumbers(currentPage, totalPages, onPageChange)}
                </div>

                {/* Next & Last */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9 shadow-sm hover:shadow-md hover:bg-accent transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!canGoNext}
                        aria-label="Go to next page"
                    >
                        <ChevronRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden sm:flex h-8 w-8 sm:h-9 sm:w-9 shadow-sm hover:shadow-md hover:bg-accent transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        onClick={() => onPageChange(totalPages)}
                        disabled={!canGoNext}
                        aria-label="Go to last page"
                    >
                        <DoubleArrowRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function renderPageNumbers(
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
) {
    const pages: (number | string)[] = [];

    // Case 1: Total pages <= 5, show all
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Case 2: Total pages > 5, use strict one-sibling logic

        // Always show first page
        pages.push(1);

        // Calculate start and end of the middle window (current +/- 1)
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        // Add start ellipsis if needed
        // If start is 2, no gap (1, 2...)
        // If start is 3, gap is 2 (1 ... 3), so we need ellipsis
        if (start > 2) {
            pages.push("ellipsis-start");
        }

        // Add middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add end ellipsis if needed
        // If end is total-1, no gap (... total-1, total)
        // If end is total-2, gap is total-1 (... total-2 ... total), so we need ellipsis
        if (end < totalPages - 1) {
            pages.push("ellipsis-end");
        }

        // Always show last page
        pages.push(totalPages);
    }

    return pages.map((page, index) => {
        if (typeof page === "string") {
            return (
                <span
                    key={`${page}-${index}`}
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center text-sm text-muted-foreground"
                >
                    ...
                </span>
            );
        }

        return (
            <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md hover:bg-accent transition-all active:scale-95 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                onClick={() => onPageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
            >
                {page}
            </Button>
        );
    });
}
