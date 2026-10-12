"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/sections", label: "Sections" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin", label: "Profile Settings" },
  { href: "/profile", label: "My Profile" },
];

export type TopBarProps = {
  email: string;
  role?: string | null;
};

export function TopBar({ email, role }: TopBarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
            Admin
          </Link>

          <nav aria-label="Admin" className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>

          {role ? (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
              {role}
            </span>
          ) : null}

          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}