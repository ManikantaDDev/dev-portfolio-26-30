"use client";

import { Switch } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";
import { useResolvedField } from "./use-form";

export type SwitchInputProps = {
  name?: string;
  value?: unknown;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-invalid"?: boolean;
};

export function SwitchInput({
  name,
  value,
  onValueChange,
  disabled,
  className,
  ...aria
}: SwitchInputProps) {
  const field = useResolvedField(name);

  const isControlled = value !== undefined;
  const checked = Boolean(isControlled ? value : field.value);

  return (
    <Switch.Root
      name={name}
      checked={checked}
      disabled={disabled}
      onCheckedChange={(next: boolean) => {
        (onValueChange ?? field.onChange)(next);
      }}
      onBlur={field.onBlur}
      aria-invalid={aria["aria-invalid"] ?? (field.invalid || undefined)}
      aria-describedby={field.describedBy}
      aria-label={aria["aria-label"]}
      aria-labelledby={aria["aria-labelledby"]}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-black/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-black",
        className,
      )}
    >
      <Switch.Thumb className="inline-block size-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[checked]:translate-x-5" />
    </Switch.Root>
  );
}
