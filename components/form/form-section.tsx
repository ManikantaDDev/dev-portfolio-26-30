"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FormSectionProps = {
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

export function FormSection({
  title,
  description,
  className,
  bodyClassName,
  children,
}: FormSectionProps) {
  return (
    <section className={cn("space-y-4 rounded-lg border p-5", className)}>
      {title || description ? (
        <header className="space-y-1">
          {title ? <h3 className="text-lg font-semibold">{title}</h3> : null}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </header>
      ) : null}

      <div className={cn("space-y-4", bodyClassName)}>{children}</div>
    </section>
  );
}
