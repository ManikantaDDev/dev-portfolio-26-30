"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { controlClassName } from "./form-styles";
import { useResolvedField } from "./use-form";

export type TextAreaInputProps = Omit<
  ComponentProps<"textarea">,
  "value" | "defaultValue"
> & {
  name?: string;
  value?: unknown;
  onValueChange?: (value: string) => void;
  autoResize?: boolean;
};

export function TextAreaInput({
  name,
  value,
  onValueChange,
  rows = 4,
  autoResize = false,
  className,
  onChange,
  onBlur,
  onFocus,
  ...props
}: TextAreaInputProps) {
  const field = useResolvedField(name);

  const isControlled = value !== undefined;
  const current = isControlled ? value : field.value;
  const text = current === null || current === undefined ? "" : String(current);

  return (
    <textarea
      {...props}
      id={field.id}
      name={field.name}
      rows={rows}
      value={text}
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
      className={cn(controlClassName, "resize-y", autoResize && "resize-none", className)}
    />
  );
}
