import { AdminShell } from "@/components/admin/admin-shell";
import { SkillsManager } from "@/features/admin/skills-manager";
import { getSkills, requireUser } from "@/lib/portfolio/queries";

export default async function SkillsPage() {
  const user = await requireUser("/admin/skills");
  const skills = await getSkills(user.id);

  return (
    <AdminShell
      title="Skills"
      description="Everything you list here appears in the Skills section of your portfolio."
    >
      <SkillsManager rows={skills} />
    </AdminShell>
  );
}
