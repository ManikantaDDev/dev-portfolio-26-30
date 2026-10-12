import { KeyRound, Lock, Mail } from "lucide-react";
import { Validations, loginSchema } from "@/forms/config/validations";
import type { FormConfig } from "@/forms/config/form";

export class LoginFormConfig {
  static formConfig(options?: { onForgotPassword?: () => void }): FormConfig {
    return {
      title: "Sign In",
      description: "Enter your credentials to access your portfolio dashboard.",
      icon: Lock,
      submitLabel: "Sign In",
      pendingLabel: "Signing In...",
      backHref: "/",
      backLabel: "Back to Home",
      footer: {
        text: "Don't have an account yet?",
        linkLabel: "Create account",
        href: "/register",
      },
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
        {
          name: "password",
          label: "Password",
          type: "password",
          icon: KeyRound,
          placeholder: "••••••••",
          autoComplete: "current-password",
          isRequired: true,
          order: 2,
          action: options?.onForgotPassword
            ? { label: "Forgot password?", onClick: options.onForgotPassword }
            : undefined,
        },
      ],
      schema: loginSchema,
    };
  }
}