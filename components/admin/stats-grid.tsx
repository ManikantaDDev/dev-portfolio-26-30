import { cn } from "@/lib/utils";

export type StatsGridProps = {
  items: { label: string; value: number | string }[];
  className?: string;
};

export function StatsGrid({ items, className }: StatsGridProps) {
  return (
    <dl className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-border bg-background p-5"
        >
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="mt-2 text-3xl font-semibold tabular-nums">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
