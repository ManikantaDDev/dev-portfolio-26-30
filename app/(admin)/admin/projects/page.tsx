import { AdminShell } from "@/components/admin/admin-shell";
import RecordEditor from "@/features/admin/record-editor";
import { ProjectPublishToggle } from "@/features/admin/project-publish-toggle";
import { deleteProjectAction, saveProjectAction } from "@/actions/projects";
import { emptyProjectValues, type ProjectFormValues } from "@/forms/config/validations";
import { getProjects, requireUser } from "@/lib/portfolio/queries";
import type { ProjectRow } from "@/types/database";

export default async function ProjectsPage() {
  const user = await requireUser("/admin/projects");
  const projects = await getProjects(user.id);

  return (
    <AdminShell
      title="Projects"
      description="Only published projects show up on your public portfolio."
    >
      <RecordEditor<ProjectRow, ProjectFormValues>
        title="Your Projects"
        description="Publish a project when it is ready for visitors."
        rows={projects}
        idOf={(project) => project.id}
        toFormValues={(project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          tags: project.tags.join(", "),
          image_url: project.image_url ?? "",
          live_url: project.live_url ?? "",
          github_url: project.github_url ?? "",
          is_published: project.is_published,
          is_featured: project.is_featured,
          display_order: project.display_order,
        })}
        emptyValues={{ ...emptyProjectValues }}
        formKey="project"
        action={saveProjectAction}
        deleteAction={deleteProjectAction}
        emptyMessage="No projects yet. Add your first one below."
        rowActions={(project) => (
          <ProjectPublishToggle id={project.id} isPublished={project.is_published} />
        )}
        columns={[
          {
            header: "Project",
            render: (project) => (
              <div className="min-w-0">
                <p className="truncate font-medium">{project.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {project.tags.length > 0 ? project.tags.join(" · ") : "No tags"}
                </p>
              </div>
            ),
          },
          {
            header: "Status",
            render: (project) => (
              <span className="text-muted-foreground">
                {project.is_published ? "Published" : "Draft"}
              </span>
            ),
          },
          {
            header: "Order",
            className: "text-right",
            render: (project) => (
              <span className="text-muted-foreground">{project.display_order}</span>
            ),
          },
        ]}
      />
    </AdminShell>
  );
}
