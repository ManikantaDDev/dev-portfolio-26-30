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
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <GenericForm
        formKey="reset-password"
        configOptions={{ email: current.user.email ?? undefined }}
        action={updatePasswordAction}
      />
    </main>
  );
}