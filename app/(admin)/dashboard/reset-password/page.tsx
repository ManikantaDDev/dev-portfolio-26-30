import { redirect } from "next/navigation";
import GenericForm from "@/forms/generic-form";
import { updatePasswordAction } from "@/actions/auth";
import { getCurrentProfile } from "@/lib/supabase/profile";

export default async function ResetPasswordPage() {
  const current = await getCurrentProfile();

  if (!current) {
    redirect("/login?error=auth_callback_failed");
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
      <GenericForm
        formKey="reset-password"
        configOptions={{ email: current.user.email ?? undefined }}
        action={updatePasswordAction}
      />
    </div>
  );
}