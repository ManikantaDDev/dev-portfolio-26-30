import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectEditor } from "@/components/admin/project-editor";
import { requireUser } from "@/lib/auth/get-session";
import { projects } from "@/lib/demo/portfolio-data";

export default async function ProjectsPage() {
  await requireUser("/dashboard/projects");

  return (
    <AdminShell
      title="Projects"
      description="Create and edit portfolio projects."
    >
      <ProjectEditor projects={projects} />
    </AdminShell>
  );
}
