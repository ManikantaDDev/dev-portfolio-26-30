import { AdminShell } from "@/components/admin/admin-shell";
import { SectionEditor } from "@/components/admin/section-editor";
import { requireUser } from "@/lib/auth/get-session";
import { sections } from "@/lib/demo/portfolio-data";

export default async function SectionsPage() {
  const session = await requireUser("/dashboard/sections");

  return (
    <AdminShell
      title="Sections"
      description="Show, hide, and reorder the blocks on the public portfolio."
      email={session.email}
      isAdmin={session.isAdmin}
    >
      <SectionEditor sections={sections} />
    </AdminShell>
  );
}
