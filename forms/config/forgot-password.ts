import { LockKeyhole, Mail } from "lucide-react";
import { Validations, forgotPasswordSchema } from "@/forms/config/validations";
import type { FormConfig } from "@/forms/config/form";

export class ForgotPasswordFormConfig {
  static formConfig(): FormConfig {
    return {
      title: "Reset Password",
      description: "Enter your account email to receive a password reset link.",
      icon: LockKeyhole,
      submitLabel: "Send Reset Link",
      pendingLabel: "Sending Link...",
      cancelLabel: "Cancel and return to sign in",
      backHref: "/",
      backLabel: "Back to Home",
      inputs: [
        {
          name: "email",
          label: "Email Address",
          type: "email",
          icon: Mail,
          placeholder: "admin@example.com",
          autoComplete: "email",
          isRequired: true,
          validation: Validations.email,
          order: 1,
        },
      ],
      schema: forgotPasswordSchema,
    };
  }
}