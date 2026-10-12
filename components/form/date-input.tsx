"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { controlClassName } from "./form-styles";
import { useResolvedField } from "./use-form";

export type DateInputType = "date" | "datetime-local" | "month" | "time";

export type DateInputProps = Omit<
  ComponentProps<"input">,
  "value" | "defaultValue" | "type"
> & {
  name?: string;
  value?: unknown;
  onValueChange?: (value: string) => void;
  dateType?: DateInputType;
};

function toDateString(value: unknown, dateType: DateInputType): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (value instanceof Date) {
    if (dateType === "date" || dateType === "month") {
      return value.toISOString().slice(0, dateType === "month" ? 7 : 10);
    }

    return value.toISOString().slice(0, 16);
  }

  return String(value);
}

export function DateInput({
  name,
  value,
  onValueChange,
  dateType = "date",
  className,
  onChange,
  onBlur,
  onFocus,
  ...props
}: DateInputProps) {
  const field = useResolvedField(name);

  const isControlled = value !== undefined;
  const current = isControlled ? value : field.value;

  return (
    <input
      {...props}
      id={field.id}
      name={field.name}
      type={dateType}
      value={toDateString(current, dateType)}
      onChange={(event) => {
        const next = event.target.value;

        if (onValueChange) {
          onValueChange(next);
        } else if (dateType === "date" || dateType === "datetime-local") {
          field.onChange(next === "" ? null : new Date(next));
        } else {
          field.onChange(next);
        }

        onChange?.(event);
      }}
      onBlur={(event) => {
        field.onBlur();
        onBlur?.(event);
      }}
      onFocus={(event) => {
        field.onFocus();
        onFocus?.(event);
      }}
      aria-invalid={props["aria-invalid"] ?? (field.invalid || undefined)}
      aria-describedby={field.describedBy}
      className={cn(controlClassName, className)}
    />
  );
}
