"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * The migration that ships ownership-based RLS. Blocked on this one
 * statement until it is applied:
 */
const RECURSION_FIX = `DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
NOTIFY pgrst, 'reload schema';`;

const MIGRATIONS = [
  "00000000000000_init_schema.sql",
  "20260101000000_profile_fields.sql",
  "20260201000000_admin_portfolio.sql",
  "20260202000000_claim_policy.sql",
];

const CLAIM_FIX = `DROP POLICY IF EXISTS "Users can manage portfolio settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Users can claim the portfolio" ON public.portfolio_settings;

CREATE POLICY "Users can manage portfolio settings"
ON public.portfolio_settings FOR ALL TO authenticated
USING (key <> 'owner_id') WITH CHECK (key <> 'owner_id');

CREATE POLICY "Users can claim the portfolio"
ON public.portfolio_settings FOR INSERT TO authenticated
WITH CHECK (key = 'owner_id');

NOTIFY pgrst, 'reload schema';`;

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = error.message ?? "";

  const isRecursion = message.includes("infinite recursion");
  const isClaimBlocked = /row-level security|violates row-level/i.test(message);
  const isMissingSchema = /PGRST20\d|Could not find the table/.test(message);
  const isMissingRelation = /relation .* does not exist/.test(message);

  let cause = "The database rejected the request. Check the details below.";
  let steps: string[] = [];
  let snippet = RECURSION_FIX;

  if (isClaimBlocked) {
    cause =
      "The policy that lets the first account claim the published portfolio has not been applied yet, so the owner_id row cannot be written.";
    steps = [
      "In Supabase, open SQL Editor and run:",
      "supabase/migrations/20260202000000_claim_policy.sql",
      "Reload this page.",
    ];
    snippet = CLAIM_FIX;
  } else if (isRecursion) {
    cause =
      "A row level security policy on the profiles table reads the profiles table inside its own USING clause, which Postgres cannot evaluate. It blocks every signed-in request until the policy is dropped.";
    steps = [
      "In Supabase, open SQL Editor and run:",
      RECURSION_FIX,
      `Then run the three migrations in order: ${MIGRATIONS.join(", ")}.`,
      "Reload this page.",
    ];
  } else if (isMissingSchema || isMissingRelation) {
    cause =
      "The database has not been set up yet, or PostgREST has not reloaded the schema after the tables were created.";
    steps = [
      "In Supabase, open SQL Editor and run the three migrations in order:",
      MIGRATIONS.join(", "),
      "Then run: NOTIFY pgrst, 'reload schema';",
      "If that does not help, use Project Settings -> API -> Restart.",
      "Reload this page.",
    ];
  }

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-10">
      <div className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/10 p-5">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div className="min-w-0 space-y-2">
          <h1 className="text-lg font-semibold text-destructive">
            The admin panel could not reach your database
          </h1>
          <p className="text-sm leading-relaxed">{cause}</p>
        </div>
      </div>

      {steps.length > 0 ? (
        <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-xs">
          <h2 className="text-sm font-semibold">How to fix it</h2>
          {steps.map((step) => (
            <p key={step} className="text-sm text-muted-foreground">
              {step}
            </p>
          ))}
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 text-xs">
            <code>{snippet}</code>
          </pre>
        </div>
      ) : null}

      <details className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <summary className="cursor-pointer text-sm font-medium">Error details</summary>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs text-muted-foreground">
          {message}
        </pre>
      </details>

      <div className="flex flex-wrap gap-3">
        <Button onClick={reset} variant="outline" size="sm">
          <RefreshCw />
          Try again
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        A step by step version of this diagnostic lives in the repo at{" "}
        <code className="rounded bg-muted px-1 py-0.5">supabase/diagnose-and-repair.sql</code>.
      </p>
    </div>
  );
}
