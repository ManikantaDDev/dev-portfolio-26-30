"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc";

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  accessor: (row: T) => unknown;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
};

export type UseTableOptions<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  pageSize?: number;
  initialSort?: { columnId: string; direction: SortDirection };
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function useTable<T>({
  data,
  columns,
  pageSize = 10,
  initialSort,
}: UseTableOptions<T>) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(initialSort ?? null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (query.length === 0) {
      return data;
    }

    return data.filter((row) =>
      columns.some((column) =>
        String(column.accessor(row) ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [columns, data, search]);

  const sorted = useMemo(() => {
    if (!sort) {
      return filtered;
    }

    const column = columns.find((item) => item.id === sort.columnId);

    if (!column) {
      return filtered;
    }

    const factor = sort.direction === "asc" ? 1 : -1;

    return [...filtered].sort((left, right) => {
      const a = column.accessor(left);
      const b = column.accessor(right);

      if (a === b) {
        return 0;
      }

      if (a === null || a === undefined) {
        return 1;
      }

      if (b === null || b === undefined) {
        return -1;
      }

      if (typeof a === "number" && typeof b === "number") {
        return (a - b) * factor;
      }

      if (a instanceof Date && b instanceof Date) {
        return (a.getTime() - b.getTime()) * factor;
      }

      return String(a).localeCompare(String(b)) * factor;
    });
  }, [columns, filtered, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);

  const rows = useMemo(
    () => sorted.slice(safePage * pageSize, safePage * pageSize + pageSize),
    [pageSize, safePage, sorted],
  );

  function toggleSort(columnId: string) {
    setPage(0);

    setSort((current) => {
      if (current?.columnId !== columnId) {
        return { columnId, direction: "asc" };
      }

      return {
        columnId,
        direction: current.direction === "asc" ? "desc" : "asc",
      };
    });
  }

  return {
    rows,
    columns,
    search,
    setSearch,
    sort,
    setSort,
    toggleSort,
    page: safePage,
    pageCount,
    setPage,
    pageSize,
    total: sorted.length,
    isEmpty: sorted.length === 0,
  };
}

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  searchPlaceholder?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  sort?: { columnId: string; direction: SortDirection } | null;
  onSortChange?: (sort: { columnId: string; direction: SortDirection }) => void;
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  searchPlaceholder = "Search...",
  search,
  onSearchChange,
  sort,
  onSortChange,
  page = 0,
  pageCount = 1,
  onPageChange,
  emptyMessage = "No records found.",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("space-y-4", className)}>
      {onSearchChange ? (
        <input
          type="search"
          value={search ?? ""}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-full rounded-md border border-black/20 px-3 py-2 text-sm outline-none focus-visible:border-black sm:max-w-xs"
        />
      ) : null}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-black/[0.03]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "px-4 py-3 font-medium",
                    alignClasses[column.align ?? "left"],
                    column.className,
                  )}
                >
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() =>
                        onSortChange({
                          columnId: column.id,
                          direction:
                            sort?.columnId === column.id && sort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                      className="inline-flex items-center gap-1"
                    >
                      {column.header}
                      <span aria-hidden className="text-muted-foreground">
                        {sort?.columnId === column.id
                          ? sort.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={rowKey(row)} className="border-t">
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "px-4 py-3 align-middle",
                        alignClasses[column.align ?? "left"],
                        column.className,
                      )}
                    >
                      {column.cell
                        ? column.cell(row)
                        : (column.accessor(row) as ReactNode) ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && onPageChange ? (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            aria-label="Previous page"
            className="rounded-md border p-2 disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>

          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {pageCount}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount - 1}
            aria-label="Next page"
            className="rounded-md border p-2 disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
