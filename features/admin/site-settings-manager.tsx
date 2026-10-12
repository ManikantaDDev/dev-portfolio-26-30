"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { saveSiteSettingsAction } from "@/actions/settings";
import { SITE_SETTINGS } from "@/lib/portfolio/settings-def";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Renders one input per setting. The key list is metadata; every value shown
 * here was read from `portfolio_settings`.
 */
export function SiteSettingsManager({
  values,
}: {
  values: Record<string, string>;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Record<string, string>>(values);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const dirty = SITE_SETTINGS.some(
    (setting) => (draft[setting.key] ?? "") !== (values[setting.key] ?? ""),
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      setErrorMessage(null);
      setSavedMessage(null);

      const response = await saveSiteSettingsAction(draft);

      if (response?.error) {
        setErrorMessage(response.error);
        return;
      }

      setSavedMessage(response?.message ?? null);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p className="leading-snug">{errorMessage}</p>
        </div>
      ) : null}

      <div className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-xs">
        {SITE_SETTINGS.map((setting) => (
          <div key={setting.key} className="space-y-2">
            <Label htmlFor={setting.key}>{setting.label}</Label>

            {setting.field === "textarea" ? (
              <Textarea
                id={setting.key}
                rows={setting.rows ?? 3}
                placeholder={setting.placeholder}
                disabled={isPending}
                value={draft[setting.key] ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [setting.key]: event.target.value }))
                }
              />
            ) : (
              <Input
                id={setting.key}
                type={setting.field === "url" ? "url" : "text"}
                placeholder={setting.placeholder}
                disabled={isPending}
                value={draft[setting.key] ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [setting.key]: event.target.value }))
                }
              />
            )}

            <p className="text-xs text-muted-foreground">{setting.helpText}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-4">
        {savedMessage ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            {savedMessage}
          </span>
        ) : null}

        <Button type="submit" disabled={isPending || !dirty}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
