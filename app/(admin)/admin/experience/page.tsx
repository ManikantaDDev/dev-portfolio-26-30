import { AdminShell } from "@/components/admin/admin-shell";
import { ExperienceManager } from "@/features/admin/experience-manager";
import { getExperiences, requireUser } from "@/lib/portfolio/queries";

export default async function ExperiencePage() {
  const user = await requireUser("/admin/experience");
  const experiences = await getExperiences(user.id);

  return (
    <AdminShell
      title="Experience"
      description="Your work history, newest first on the public portfolio."
    >
      <ExperienceManager rows={experiences} />
    </AdminShell>
  );
}
