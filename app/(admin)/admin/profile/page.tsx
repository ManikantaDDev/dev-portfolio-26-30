import { AdminShell } from "@/components/admin/admin-shell";
import GenericForm from "@/forms/generic-form";
import { updateProfileAction } from "@/actions/profile";
import { toProfileFormValues } from "@/lib/portfolio/profile";
import { getProfileById, requireUser } from "@/lib/portfolio/queries";

export default async function ProfileSettingsPage() {
  const user = await requireUser("/admin/profile");
  const profile = await getProfileById(user.id);

  if (!profile) {
    return (
      <AdminShell
        title="Profile"
        description="Your profile record could not be loaded. Open the dashboard once to create it."
      />
    );
  }

  return (
    <AdminShell
      title="Profile"
      description="These details are what visitors see on your public portfolio. Your email and role are managed by your account and cannot be changed here."
    >
      <GenericForm
        key={JSON.stringify(profile)}
        formKey="profile"
        action={updateProfileAction}
        initialValues={toProfileFormValues(profile)}
        className="max-w-2xl"
      />
    </AdminShell>
  );
}
