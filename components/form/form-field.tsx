"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { errorClassName, hintClassName, labelClassName } from "./form-styles";
import {
  FieldContext,
  useFormContext,
  type FieldMeta,
  type InjectedFieldMeta,
} from "./use-form";

export type FormFieldProps = {
  name: string;
  label?: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  children: ReactNode | ((field: FieldMeta) => ReactNode);
};

export function FormField({
  name,
  label,
  hint,
  required,
  className,
  labelClassName: labelClassNameOverride,
  children,
}: FormFieldProps) {
  const form = useFormContext();
  const base = form.getField(name);

  const errorId = `${base.id}-error`;
  const hintId = `${base.id}-hint`;

  const describedBy = [hint ? hintId : null, base.error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  const injected: InjectedFieldMeta = { ...base, describedBy: describedBy || undefined };

  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <label htmlFor={base.id} className={labelClassNameOverride ?? labelClassName}>
          {label}
          {required ? <span className="ml-0.5 text-red-600">*</span> : null}
        </label>
      ) : null}

      <FieldContext.Provider value={injected}>
        {typeof children === "function" ? children(base) : children}
      </FieldContext.Provider>

      {hint ? (
        <p id={hintId} className={hintClassName}>
          {hint}
        </p>
      ) : null}

      {base.error ? (
        <p id={errorId} role="alert" className={errorClassName}>
          {base.error}
        </p>
      ) : null}
    </div>
  );
}
