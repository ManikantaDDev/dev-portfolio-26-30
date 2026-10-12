import { redirect } from "next/navigation";
import ResetPasswordForm from "@/features/auth/reset-password-form";
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
      <ResetPasswordForm email={user.email ?? ""} />
    </main>
  );
}