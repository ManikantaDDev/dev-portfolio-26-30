import { redirect } from "next/navigation";
import GenericForm from "@/forms/generic-form";
import { ResetPasswordFormConfig } from "@/forms/config/reset-password";
import { updatePasswordAction } from "@/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=auth_callback_failed");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <GenericForm
        formKey="reset-password"
        config={ResetPasswordFormConfig.formConfig(user.email ?? undefined)}
        action={updatePasswordAction}
      />
    </main>
  );
}