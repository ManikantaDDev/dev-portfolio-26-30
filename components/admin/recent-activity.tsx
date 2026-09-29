import { cn } from "@/lib/utils";

export type ActivityEntry = {
  id: string;
  message: string;
  time: string;
};

const entries: ActivityEntry[] = [
  { id: "a1", message: "Published “Query Visualizer”", time: "2 hours ago" },
  { id: "a2", message: "Updated project “Realtime Notes”", time: "Yesterday" },
  { id: "a3", message: "Hid the “Skills” section", time: "3 days ago" },
  { id: "a4", message: "Created account", time: "1 week ago" },
];

export function RecentActivity({ className }: { className?: string }) {
  return (
    <section
      className={cn("rounded-lg border border-border bg-background p-5", className)}
    >
      <h2 className="text-lg font-semibold">Recent activity</h2>

      <ol className="mt-4 space-y-4">
        {entries.map((entry) => (
          <li key={entry.id} className="flex flex-col gap-1">
            <p className="text-sm">{entry.message}</p>
            <p className="text-xs text-muted-foreground">{entry.time}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
