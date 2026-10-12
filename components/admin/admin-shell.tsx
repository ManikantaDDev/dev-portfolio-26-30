export type AdminShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function AdminShell({
  title,
  description,
  children,
  actions,
}: AdminShellProps) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {actions}
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}