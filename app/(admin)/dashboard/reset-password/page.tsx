import GenericForm from "@/forms/generic-form";
import { updatePasswordAction } from "@/actions/auth";
import { requireUser } from "@/lib/portfolio/queries";

export default async function ResetPasswordPage() {
  const user = await requireUser("/dashboard/reset-password");

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
      <GenericForm
        formKey="reset-password"
        configOptions={{ email: user.email ?? undefined }}
        action={updatePasswordAction}
      />
    </div>
  );
}
