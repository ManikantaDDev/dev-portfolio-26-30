import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectsManager } from "@/features/admin/projects-manager";
import { getProjects, requireUser } from "@/lib/portfolio/queries";

export default async function ProjectsPage() {
  const user = await requireUser("/admin/projects");
  const projects = await getProjects(user.id);

  return (
    <AdminShell
      title="Projects"
      description="Only published projects show up on your public portfolio."
    >
      <ProjectsManager rows={projects} />
    </AdminShell>
  );
}
