import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  resetPasswordSchema,
} from "@/forms/config/validations";
import type { FormConfig } from "@/forms/config/form";

export class ResetPasswordFormConfig {
  static title = "Choose a new password";

  static formConfig(email?: string): FormConfig {
    return {
      title: ResetPasswordFormConfig.title,
      description: email
        ? `You are resetting the password for ${email}.`
        : "Enter a new password to secure your account.",
      icon: LockKeyhole,
      submitLabel: "Update Password",
      pendingLabel: "Updating Password...",
      backHref: "/",
      backLabel: "Back to Home",
      footer: {
        text: "Remembered your password?",
        linkLabel: "Back to sign in",
        href: "/login",
      },
      inputs: [
        {
          name: "password",
          label: "New Password",
          type: "password",
          icon: KeyRound,
          placeholder: `At least ${PASSWORD_MIN_LENGTH} characters`,
          autoComplete: "new-password",
          minLength: PASSWORD_MIN_LENGTH,
          maxLength: PASSWORD_MAX_LENGTH,
          isRequired: true,
          order: 1,
        },
        {
          name: "confirmPassword",
          label: "Confirm New Password",
          type: "password",
          icon: ShieldCheck,
          placeholder: "Re-enter your new password",
          autoComplete: "new-password",
          isRequired: true,
          order: 2,
        },
      ],
      schema: resetPasswordSchema,
    };
  }
}