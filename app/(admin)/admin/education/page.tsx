import { AdminShell } from "@/components/admin/admin-shell";
import { EducationManager } from "@/features/admin/education-manager";
import { getEducations, requireUser } from "@/lib/portfolio/queries";

export default async function EducationPage() {
  const user = await requireUser("/admin/education");
  const educations = await getEducations(user.id);

  return (
    <AdminShell
      title="Education"
      description="Qualifications you want listed on your portfolio."
    >
      <EducationManager rows={educations} />
    </AdminShell>
  );
}
