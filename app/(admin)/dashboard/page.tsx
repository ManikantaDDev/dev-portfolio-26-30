import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  User,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { getPortfolioStats, getSections, getOwnerId, requireUser } from "@/lib/portfolio/queries";
import { cn } from "@/lib/utils";

const STAT_DEFS = [
  { key: "skills", label: "Skills", href: "/admin/skills", icon: Sparkles },
  { key: "projects", label: "Projects", href: "/admin/projects", icon: Briefcase },
  { key: "experiences", label: "Roles", href: "/admin/experience", icon: Briefcase },
  { key: "educations", label: "Education", href: "/admin/education", icon: GraduationCap },
] as const;

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const ownerId = await getOwnerId();

  const [stats, sections] = await Promise.all([
    getPortfolioStats(user.id),
    getSections(user.id),
  ]);

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Everything on this page is counted straight from the database.
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            View My Portfolio
            <ArrowUpRight data-icon="inline-end" />
          </Link>
        </div>

        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="bg-primary transition-all"
            style={{ width: `${stats.profileCompletion}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Profile {stats.profileCompletion}% complete.{" "}
          <Link href="/admin/profile" className="underline underline-offset-4">
            Finish your profile
          </Link>
        </p>
      </section>

      {ownerId !== user.id ? (
        <section className="flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="leading-snug">
            A different account owns the published portfolio, so the changes you make here stay
            private. Everything you add below is still saved to your own profile.
          </p>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_DEFS.map((stat) => (
          <Link
            key={stat.key}
            href={stat.href}
            className="group rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="size-4 text-muted-foreground" />
              <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight">{stats[stat.key]}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <h2 className="text-sm font-semibold">Publishing</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Published projects</dt>
              <dd className="font-medium">
                {stats.publishedProjects} of {stats.projects}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Hidden sections</dt>
              <dd className="font-medium">
                {stats.hiddenSections} of {stats.totalSections}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/admin/projects">
              <Button variant="outline" size="sm">
                Manage projects
              </Button>
            </Link>
            <Link href="/admin/sections">
              <Button variant="outline" size="sm">
                Manage sections
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <h2 className="text-sm font-semibold">Quick links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { href: "/admin/profile", label: "Profile details" },
              { href: "/admin/settings", label: "Site settings" },
              { href: "/dashboard/reset-password", label: "Change password" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <User className="size-3.5" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <h2 className="text-sm font-semibold">Section visibility</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {sections.map((section) => (
            <li
              key={section.id}
              className="flex items-center justify-between gap-4 border-b border-border/60 pb-2 last:border-0"
            >
              <span className="capitalize">{section.name}</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {section.is_visible ? (
                  <>
                    <Eye className="size-3.5" /> Visible
                  </>
                ) : (
                  <>
                    <EyeOff className="size-3.5" /> Hidden
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
