"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { controlClassName } from "./form-styles";
import { useResolvedField } from "./use-form";

export type UrlInputProps = Omit<
  ComponentProps<"input">,
  "value" | "defaultValue" | "type"
> & {
  name?: string;
  value?: unknown;
  onValueChange?: (value: string) => void;
  allowEmpty?: boolean;
};

export function UrlInput({
  name,
  value,
  onValueChange,
  allowEmpty = true,
  className,
  onChange,
  onBlur,
  onFocus,
  ...props
}: UrlInputProps) {
  const field = useResolvedField(name);

  const isControlled = value !== undefined;
  const current = isControlled ? value : field.value;
  const text = current === null || current === undefined ? "" : String(current);

  return (
    <input
      {...props}
      id={field.id}
      name={field.name}
      type="url"
      required={props.required ?? !allowEmpty}
      placeholder={props.placeholder ?? "https://example.com"}
      value={text}
      onChange={(event) => {
        const next = event.target.value;

        if (onValueChange) {
          onValueChange(next);
        } else {
          field.onChange(next === "" && allowEmpty ? null : next);
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
