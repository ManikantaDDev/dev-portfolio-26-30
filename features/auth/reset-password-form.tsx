"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/app/api/models/user/user";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

const MIN_PASSWORD_LENGTH = 12;

function passwordErrorMessage(message: string) {
  if (message.includes("at least")) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }
  return message;
}

export default function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      setErrorMessage(
        firstIssue.path[0] === "password"
          ? passwordErrorMessage(firstIssue.message)
          : firstIssue.message
      );
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
          if (error.message.toLowerCase().includes("session")) {
            setErrorMessage(
              "Your reset session has expired. Please request a new password reset link."
            );
          } else if (
            error.message.toLowerCase().includes("new password should be different")
          ) {
            setErrorMessage(
              "Your new password must be different from your previous password."
            );
          } else {
            setErrorMessage(error.message);
          }
          return;
        }

        setInfoMessage("Password updated successfully. Redirecting to your dashboard...");
        router.refresh();
        router.push("/dashboard");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
        setErrorMessage(message);
      }
    });
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-border/80">
      <CardHeader className="space-y-1.5 pb-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to Home
          </Link>
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LockKeyhole className="size-4" />
          </div>
        </div>

        <CardTitle className="text-2xl font-bold tracking-tight">
          Choose a new password
        </CardTitle>
        <CardDescription className="text-sm">
          {email
            ? `You are resetting the password for ${email}.`
            : "Enter a new password to secure your account."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Error notification */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        )}

        {/* Success notification */}
        {infoMessage && (
          <div
            role="status"
            className="mb-4 flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <p className="leading-snug">{infoMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                autoComplete="new-password"
                placeholder="At least 12 characters"
                minLength={MIN_PASSWORD_LENGTH}
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                className="pl-9 pr-9"
              />
              <KeyRound className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPending}
                className="pl-9 pr-9"
              />
              <ShieldCheck className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {password.length > 0 && password !== confirmPassword && confirmPassword.length > 0 && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>

          <Button type="submit" className="w-full font-medium" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border/50 text-center text-xs text-muted-foreground">
        <div>
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}