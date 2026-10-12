import GenericForm from "@/forms/generic-form";
import { updateProfileAction } from "@/actions/profile";
import { getCurrentProfile, toProfileFormValues } from "@/lib/supabase/profile";

export default async function AdminProfilePage() {
  const current = await getCurrentProfile();

  if (!current) {
    return null;
  }

  const initialValues = toProfileFormValues(current.profile);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Profile Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update the details shown on your portfolio. Your email and role are managed by your
          account and can&apos;t be changed here.
        </p>
      </div>

      <GenericForm
        key={JSON.stringify(initialValues)}
        formKey="profile"
        action={updateProfileAction}
        initialValues={initialValues}
        className="max-w-2xl"
      />
    </div>
  );
}