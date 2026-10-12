import { cn } from "@/lib/utils";

export type PublicFooterProps = {
  name?: string;
  note?: string;
  className?: string;
};

export function PublicFooter({
  name = "Portfolio",
  note,
  className,
}: PublicFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t border-border", className)}>
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          {year} {name}. All rights reserved.
        </p>

        {note ? <p>{note}</p> : null}
      </div>
    </footer>
  );
}
