import Link from "next/link";
import { signOutAction as logout } from "@/actions/auth";
import { cn } from "@/lib/utils";

export type AdminShellProps = {
  title: string;
  description?: string;
  email: string;
  isAdmin: boolean;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/sections", label: "Sections" },
];

export function AdminShell({
  title,
  description,
  email,
  isAdmin,
  children,
  actions,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-semibold">
              Admin
            </Link>

            <nav aria-label="Admin" className="hidden gap-4 sm:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm text-muted-foreground transition-colors hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>

            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
              {isAdmin ? "admin" : "viewer"}
            </span>

            <form action={logout}>
              <button
                type="submit"
                className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
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
      </main>
    </div>
  );
}
