"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FormGridProps = {
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  children: ReactNode;
};

const columnClasses: Record<NonNullable<FormGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function FormGrid({ columns = 2, className, children }: FormGridProps) {
  return (
    <div className={cn("grid gap-4", columnClasses[columns], className)}>
      {children}
    </div>
  );
}
