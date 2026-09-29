import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatsGrid } from "@/components/admin/stats-grid";
import { ProjectsTable } from "@/components/admin/projects-table";
import { RecentActivity } from "@/components/admin/recent-activity";
import { requireUser } from "@/lib/auth/get-session";
import { experiences, projects, sections } from "@/lib/demo/portfolio-data";

export default async function DashboardPage() {
  const session = await requireUser("/dashboard");

  return (
    <AdminShell
      title={`Welcome back, ${session.email.split("@")[0]}`}
      description="A demo view of the admin area. Data below is mocked."
      email={session.email}
      isAdmin={session.isAdmin}
      actions={
        <Link
          href="/dashboard/projects"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Manage projects
        </Link>
      }
    >
      <StatsGrid
        items={[
          { label: "Total projects", value: projects.length },
          {
            label: "Published",
            value: projects.filter((project) => project.isPublished).length,
          },
          { label: "Visible sections", value: sections.filter((s) => s.isVisible).length },
          { label: "Experience entries", value: experiences.length },
        ]}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProjectsTable projects={projects} />
        </div>

        <RecentActivity />
      </div>
    </AdminShell>
  );
}
