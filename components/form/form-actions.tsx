"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useFormContext } from "./use-form";

export type FormActionsProps = {
  submitLabel?: ReactNode;
  cancelLabel?: ReactNode;
  resetLabel?: ReactNode;
  onCancel?: () => void;
  showReset?: boolean;
  loadingLabel?: ReactNode;
  sticky?: boolean;
  className?: string;
  children?: ReactNode;
};

export function FormActions({
  submitLabel = "Save",
  cancelLabel = "Cancel",
  resetLabel = "Reset",
  onCancel,
  showReset = false,
  loadingLabel = "Saving...",
  sticky = false,
  className,
  children,
}: FormActionsProps) {
  const form = useFormContext();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-3",
        sticky && "sticky bottom-0 rounded-md bg-white/90 p-3 backdrop-blur",
        className,
      )}
    >
      {children}

      {showReset ? (
        <button
          type="button"
          onClick={() => form.reset()}
          disabled={form.isSubmitting}
          className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
        >
          {resetLabel}
        </button>
      ) : null}

      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          disabled={form.isSubmitting}
          className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
        >
          {cancelLabel}
        </button>
      ) : null}

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {form.isSubmitting ? loadingLabel : submitLabel}
      </button>
    </div>
  );
}
