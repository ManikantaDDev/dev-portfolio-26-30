"use client";

import { useRouter } from "next/navigation";
import GenericForm, { type SubmitResult } from "@/forms/generic-form";
import { RegisterFormConfig } from "@/forms/config/register";
import type { RegisterFormValues } from "@/forms/config/validations";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  async function handleRegister(values: RegisterFormValues): Promise<SubmitResult> {
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { name: values.name },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      router.refresh();
      return {
        message: "Registration successful. Please check your email to confirm your account.",
      };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : "Failed to create your account.",
      };
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <GenericForm<RegisterFormValues>
        formKey="register"
        config={RegisterFormConfig.formConfig()}
        onSubmit={handleRegister}
      />
    </main>
  );
}