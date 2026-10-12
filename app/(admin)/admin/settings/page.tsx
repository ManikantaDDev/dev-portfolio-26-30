import { AdminShell } from "@/components/admin/admin-shell";
import { SiteSettingsManager } from "@/features/admin/site-settings-manager";
import { getSiteSettings, requireUser } from "@/lib/portfolio/queries";

export default async function SettingsPage() {
  await requireUser("/admin/settings");
  const values = await getSiteSettings();

  return (
    <AdminShell
      title="Site Settings"
      description="Site-wide copy and links. Anything left blank stays hidden on the public portfolio."
    >
      <SiteSettingsManager values={values} />
    </AdminShell>
  );
}
