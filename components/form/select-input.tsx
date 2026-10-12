"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { controlClassName } from "./form-styles";
import { useResolvedField } from "./use-form";

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

export type SelectInputProps<T extends string = string> = Omit<
  ComponentProps<"select">,
  "value" | "defaultValue" | "children"
> & {
  name?: string;
  options: SelectOption<T>[];
  value?: T | null;
  onValueChange?: (value: T) => void;
  placeholder?: string;
};

export function SelectInput<T extends string = string>({
  name,
  options,
  value,
  onValueChange,
  placeholder,
  className,
  onChange,
  onBlur,
  onFocus,
  ...props
}: SelectInputProps<T>) {
  const field = useResolvedField(name);

  const isControlled = value !== undefined;
  const current = isControlled ? value : field.value;
  const selected = current === null || current === undefined ? "" : String(current);

  return (
    <select
      {...props}
      id={field.id}
      name={field.name}
      value={selected}
      onChange={(event) => {
        const next = event.target.value as T;

        (onValueChange ?? field.onChange)(next);
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
      className={cn(controlClassName, "appearance-none pr-8", className)}
    >
      {placeholder ? (
        <option value="" disabled={props.required}>
          {placeholder}
        </option>
      ) : null}

      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
