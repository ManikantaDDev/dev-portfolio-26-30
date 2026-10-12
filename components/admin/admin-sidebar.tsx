"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Settings2,
  Sparkles,
  User,
} from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/sections", label: "Sections", icon: Layers },
  { href: "/admin/settings", label: "Site Settings", icon: Settings2 },
];

export type AdminSidebarProps = {
  email: string;
  role: string | null;
  /** True when this account owns the published portfolio. */
  isOwner: boolean;
};

export function AdminSidebar({ email, role, isOwner }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-border bg-card/40 lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-6 p-6">
        <div>
          <Link href="/dashboard" className="text-base font-semibold tracking-tight">
            Portfolio Admin
          </Link>
          <p className="mt-1 truncate text-xs text-muted-foreground">{email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {role ? (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                {role}
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                isOwner
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isOwner ? "Published" : "Not published"}
            </span>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-center gap-2",
          )}
        >
          <ExternalLink />
          View My Portfolio
        </Link>

        <nav aria-label="Admin" className="flex flex-wrap gap-1 lg:flex-col">
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
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form action={signOutAction} className="mt-auto">
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
