"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlClassName } from "./form-styles";
import { useResolvedField } from "./use-form";

export type PasswordInputProps = Omit<
  ComponentProps<"input">,
  "value" | "defaultValue" | "type"
> & {
  name?: string;
  value?: unknown;
  onValueChange?: (value: string) => void;
  showToggle?: boolean;
};

export function PasswordInput({
  name,
  value,
  onValueChange,
  showToggle = true,
  className,
  onChange,
  onBlur,
  onFocus,
  ...props
}: PasswordInputProps) {
  const field = useResolvedField(name);
  const [revealed, setRevealed] = useState(false);

  const isControlled = value !== undefined;
  const current = isControlled ? value : field.value;
  const text = current === null || current === undefined ? "" : String(current);

  return (
    <div className="relative">
      <input
        {...props}
        id={field.id}
        name={field.name}
        type={revealed ? "text" : "password"}
        value={text}
        onChange={(event) => {
          const next = event.target.value;

          if (onValueChange) {
            onValueChange(next);
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
        className={cn(controlClassName, showToggle && "pr-10", className)}
      />

      {showToggle ? (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setRevealed((previous) => !previous)}
          aria-label={revealed ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
        >
          {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      ) : null}
    </div>
  );
}
