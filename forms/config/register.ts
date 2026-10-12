import { KeyRound, Mail, ShieldCheck, User } from "lucide-react";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  registerSchema,
} from "@/forms/config/validations";
import type { FormConfig } from "@/forms/config/form";

export class RegisterFormConfig {
  static formConfig(): FormConfig {
    return {
      title: "Create Account",
      description: "Register for your portfolio admin account.",
      icon: User,
      submitLabel: "Create Account",
      pendingLabel: "Creating Account...",
      backHref: "/",
      backLabel: "Back to Home",
      footer: {
        text: "Already have an account?",
        linkLabel: "Sign in",
        href: "/login",
      },
      inputs: [
        {
          name: "name",
          label: "Full Name",
          type: "text",
          icon: User,
          placeholder: "Your name",
          autoComplete: "name",
          order: 1,
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          icon: Mail,
          placeholder: "you@example.com",
          autoComplete: "email",
          isRequired: true,
          validation: registerSchema.shape.email,
          order: 2,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          icon: KeyRound,
          placeholder: `Minimum ${PASSWORD_MIN_LENGTH} characters`,
          autoComplete: "new-password",
          minLength: PASSWORD_MIN_LENGTH,
          maxLength: PASSWORD_MAX_LENGTH,
          isRequired: true,
          order: 3,
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          icon: ShieldCheck,
          placeholder: "Re-enter your password",
          autoComplete: "new-password",
          isRequired: true,
          order: 4,
        },
      ],
      schema: registerSchema,
    };
  }
}