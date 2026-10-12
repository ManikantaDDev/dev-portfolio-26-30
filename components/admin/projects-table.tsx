"use client";

import { useMemo } from "react";
import {
  DataTable,
  SwitchInput,
  useTable,
  type DataTableColumn,
} from "@/components/form";
import type { Project } from "@/lib/demo/types";

export type ProjectsTableProps = {
  projects: Project[];
  onTogglePublish?: (id: string, next: boolean) => void;
};

export function ProjectsTable({ projects, onTogglePublish }: ProjectsTableProps) {
  const columns = useMemo<DataTableColumn<Project>[]>(
    () => [
      {
        id: "title",
        header: "Project",
        accessor: (row) => row.title,
        cell: (row) => (
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {row.description}
            </p>
          </div>
        ),
        sortable: true,
      },
      {
        id: "tags",
        header: "Tags",
        accessor: (row) => row.tags.join(", "),
        cell: (row) => (
          <div className="flex flex-wrap gap-1">
            {row.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                {tag}
              </span>
            ))}
          </div>
        ),
      },
      {
        id: "stars",
        header: "Stars",
        accessor: (row) => row.stars,
        align: "right",
        sortable: true,
        className: "w-20",
      },
      {
        id: "isPublished",
        header: "Live",
        accessor: (row) => (row.isPublished ? "Yes" : "No"),
        align: "center",
        sortable: true,
        className: "w-20",
        cell: (row) =>
          onTogglePublish ? (
            <SwitchInput
              name={`projects.${row.id}.isPublished`}
              value={row.isPublished}
              onValueChange={(next) => onTogglePublish(row.id, next)}
              aria-label={`Toggle ${row.title}`}
            />
          ) : (
            <span className="text-sm">{row.isPublished ? "Yes" : "No"}</span>
          ),
      },
    ],
    [onTogglePublish],
  );

  const table = useTable({
    data: projects,
    columns,
    initialSort: { columnId: "title", direction: "asc" },
  });

  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <h2 className="text-lg font-semibold">Projects</h2>

      <div className="mt-4">
        <DataTable
          columns={table.columns}
          rows={table.rows}
          rowKey={(row) => row.id}
          search={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search projects..."
          sort={table.sort}
          onSortChange={table.setSort}
          page={table.page}
          pageCount={table.pageCount}
          onPageChange={table.setPage}
          emptyMessage="No projects match your search."
        />
      </div>
    </section>
  );
}
