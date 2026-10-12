"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { controlClassName } from "./form-styles";
import { useResolvedField, type FieldMeta } from "./use-form";

type TextInputOwnProps = {
  name?: string;
  value?: unknown;
  onValueChange?: (value: string) => void;
};

export type TextInputProps = Omit<ComponentProps<"input">, "value" | "defaultValue"> &
  TextInputOwnProps;

function toInputValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export function TextInput({
  name,
  value,
  onValueChange,
  type = "text",
  className,
  onChange,
  onBlur,
  onFocus,
  ...props
}: TextInputProps) {
  const field = useResolvedField(name);

  const isControlled = value !== undefined;

  return (
    <input
      {...props}
      id={field.id}
      name={field.name}
      type={type}
      value={isControlled ? toInputValue(value) : toInputValue(field.value)}
      onChange={(event) => {
        if (isControlled) {
          onValueChange?.(event.target.value);
        } else {
          field.onChange(event.target.value);
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

export type { FieldMeta };
