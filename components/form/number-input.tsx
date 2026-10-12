"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { controlClassName } from "./form-styles";
import { useResolvedField } from "./use-form";

export type NumberInputProps = Omit<
  ComponentProps<"input">,
  "value" | "defaultValue" | "type" | "min" | "max" | "step"
> & {
  name?: string;
  value?: unknown;
  onValueChange?: (value: number | null) => void;
  allowDecimal?: boolean;
  min?: number;
  max?: number;
  step?: number | string;
};

export function NumberInput({
  name,
  value,
  onValueChange,
  allowDecimal = false,
  min,
  max,
  step,
  className,
  onChange,
  onBlur,
  onFocus,
  ...props
}: NumberInputProps) {
  const field = useResolvedField(name);

  const isControlled = value !== undefined;
  const current = isControlled ? value : field.value;

  const text =
    current === null || current === undefined || current === "" ? "" : String(current);

  function commit(raw: string) {
    const trimmed = raw.trim();

    if (trimmed === "") {
      (onValueChange ?? field.onChange)(null);
      return;
    }

    const parsed = allowDecimal ? Number.parseFloat(trimmed) : Number.parseInt(trimmed, 10);

    if (Number.isNaN(parsed)) {
      return;
    }

    let next = parsed;

    if (min !== undefined && next < min) {
      next = min;
    }

    if (max !== undefined && next > max) {
      next = max;
    }

    (onValueChange ?? field.onChange)(next);
  }

  return (
    <input
      {...props}
      id={field.id}
      name={field.name}
      type="number"
      inputMode={allowDecimal ? "decimal" : "numeric"}
      min={min}
      max={max}
      step={step ?? (allowDecimal ? "any" : 1)}
      value={text}
      onChange={(event) => {
        commit(event.target.value);
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
