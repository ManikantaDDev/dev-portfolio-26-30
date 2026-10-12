import { AdminShell } from "@/components/admin/admin-shell";
import { SectionManager, type SectionRowView } from "@/features/admin/section-manager";
import {
  getEducations,
  getExperiences,
  getProjects,
  getSections,
  getSkills,
  requireUser,
} from "@/lib/portfolio/queries";

export default async function SectionsPage() {
  const user = await requireUser("/admin/sections");

  const [sections, skills, projects, experiences, educations] = await Promise.all([
    getSections(user.id),
    getSkills(user.id),
    getProjects(user.id),
    getExperiences(user.id),
    getEducations(user.id),
  ]);

  const itemCounts: Record<string, number> = {
    skills: skills.length,
    projects: projects.filter((project) => project.is_published).length,
    experience: experiences.length,
    education: educations.length,
  };

  const rows: SectionRowView[] = sections.map((section) => ({
    id: section.id,
    name: section.name,
    label: section.label,
    heading: section.heading,
    description: section.description,
    is_visible: section.is_visible,
    display_order: section.display_order,
    itemCount: itemCounts[section.name] ?? 0,
  }));

  return (
    <AdminShell
      title="Sections"
      description="Show, hide, reorder and label the blocks on your public portfolio."
    >
      <SectionManager sections={rows} />
    </AdminShell>
  );
}
