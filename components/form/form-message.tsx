"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FormMessageTone = "error" | "success" | "info" | "warning";

export type FormMessageProps = {
  children?: ReactNode;
  tone?: FormMessageTone;
  className?: string;
};

const toneClasses: Record<FormMessageTone, string> = {
  error: "bg-red-50 text-red-600",
  success: "bg-green-50 text-green-700",
  info: "bg-blue-50 text-blue-700",
  warning: "bg-amber-50 text-amber-700",
};

export function FormMessage({
  children,
  tone = "info",
  className,
}: FormMessageProps) {
  if (!children) {
    return null;
  }

  return (
    <div
      role="alert"
      className={cn("rounded-md p-3 text-sm", toneClasses[tone], className)}
    >
      {children}
    </div>
  );
}
