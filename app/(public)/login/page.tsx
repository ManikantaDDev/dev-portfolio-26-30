"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import GenericForm, { type SubmitResult } from "@/forms/generic-form";
import { LoginFormConfig } from "@/forms/config/login";
import { ForgotPasswordFormConfig } from "@/forms/config/forgot-password";
import {
  type ForgotPasswordFormValues,
  type LoginFormValues,
} from "@/forms/config/validations";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "forgot-password";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";
  const urlError = searchParams.get("error");
  const [mode, setMode] = useState<Mode>("login");

  async function handleLogin(values: LoginFormValues): Promise<SubmitResult> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        const message = error.message.toLowerCase();

        if (message.includes("email not confirmed")) {
          return {
            error:
              "Your email has not been verified yet. Please check your inbox for the confirmation link.",
          };
        }

        if (message.includes("invalid login credentials")) {
          return { error: "Invalid email or password. Please verify your credentials." };
        }

        return { error: error.message };
      }

      if (data.session) {
        router.refresh();
        router.push(nextUrl);
      }

      return {};
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred during login.",
      };
    }
  }

  async function handleForgotPassword(
    values: ForgotPasswordFormValues
  ): Promise<SubmitResult> {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      setMode("login");
      return { message: "Password reset email sent! Check your inbox for the link." };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : "Failed to send password reset email.",
      };
    }
  }

  const initialError =
    urlError === "auth_callback_failed"
      ? "Authentication confirmation failed or expired. Please try signing in again."
      : null;

  return (
    <GenericForm
      key={mode}
      formKey={mode}
      initialError={initialError}
      config={
        mode === "login"
          ? LoginFormConfig.formConfig({
              onForgotPassword: () => setMode("forgot-password"),
            })
          : ForgotPasswordFormConfig.formConfig()
      }
      onSubmit={
        mode === "login"
          ? (values) => handleLogin(values as LoginFormValues)
          : (values) => handleForgotPassword(values as ForgotPasswordFormValues)
      }
      onCancel={mode === "forgot-password" ? () => setMode("login") : undefined}
    />
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </main>
  );
}