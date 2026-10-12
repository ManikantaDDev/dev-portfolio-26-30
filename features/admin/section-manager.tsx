"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  moveSectionAction,
  saveSectionAction,
  setSectionVisibilityAction,
} from "@/actions/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type SectionRowView = {
  id: string;
  name: string;
  label: string | null;
  heading: string | null;
  description: string | null;
  is_visible: boolean;
  display_order: number;
  /** Entries of content behind this section, straight from the database. */
  itemCount: number;
};

export function SectionManager({ sections }: { sections: SectionRowView[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Record<string, SectionRowView>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function draftFor(section: SectionRowView): SectionRowView {
    return drafts[section.id] ?? section;
  }

  function updateDraft(id: string, patch: Partial<SectionRowView>) {
    setDrafts((current) => {
      const base = current[id] ?? sections.find((section) => section.id === id);
      return base ? { ...current, [id]: { ...base, ...patch } } : current;
    });

    setSavedId((current) => (current === id ? null : current));
  }

  function handleSave(section: SectionRowView) {
    startTransition(async () => {
      setErrorMessage(null);

      const response = await saveSectionAction({
        id: section.id,
        label: section.label ?? "",
        heading: section.heading ?? "",
        description: section.description ?? "",
      });

      if (response?.error) {
        setErrorMessage(response.error);
        return;
      }

      setDrafts((current) => {
        const next = { ...current };
        delete next[section.id];
        return next;
      });

      setSavedId(section.id);
      router.refresh();
    });
  }

  function handleVisibility(section: SectionRowView) {
    startTransition(async () => {
      setErrorMessage(null);

      const response = await setSectionVisibilityAction(section.id, !section.is_visible);

      if (response?.error) {
        setErrorMessage(response.error);
        return;
      }

      router.refresh();
    });
  }

  function handleMove(section: SectionRowView, direction: "up" | "down") {
    startTransition(async () => {
      setErrorMessage(null);

      const response = await moveSectionAction(section.id, direction);

      if (response?.error) {
        setErrorMessage(response.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p className="leading-snug">{errorMessage}</p>
        </div>
      ) : null}

      {sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
          No sections yet. Open your dashboard once to seed them.
        </div>
      ) : null}

      {sections.map((section, index) => {
        const draft = draftFor(section);
        const dirty =
          draft.label !== section.label ||
          draft.heading !== section.heading ||
          draft.description !== section.description;

        return (
          <div key={section.id} className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold capitalize">{section.name}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    section.is_visible
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {section.is_visible ? "Visible" : "Hidden"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {section.itemCount} item{section.itemCount === 1 ? "" : "s"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMove(section, "up")}
                  disabled={isPending || index === 0}
                  aria-label={`Move ${section.name} up`}
                >
                  <ArrowUp />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMove(section, "down")}
                  disabled={isPending || index === sections.length - 1}
                  aria-label={`Move ${section.name} down`}
                >
                  <ArrowDown />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVisibility(section)}
                  disabled={isPending}
                >
                  {section.is_visible ? <EyeOff /> : <Eye />}
                  {section.is_visible ? "Hide" : "Show"}
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${section.id}-label`}>Nav Label</Label>
                <Input
                  id={`${section.id}-label`}
                  value={draft.label ?? ""}
                  placeholder="Leave blank to hide from the nav"
                  disabled={isPending}
                  onChange={(event) => updateDraft(section.id, { label: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${section.id}-heading`}>Section Heading</Label>
                <Input
                  id={`${section.id}-heading`}
                  value={draft.heading ?? ""}
                  placeholder="Leave blank for no heading"
                  disabled={isPending}
                  onChange={(event) => updateDraft(section.id, { heading: event.target.value })}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor={`${section.id}-description`}>Description</Label>
                <Textarea
                  id={`${section.id}-description`}
                  rows={2}
                  value={draft.description ?? ""}
                  placeholder="Optional supporting line under the heading"
                  disabled={isPending}
                  onChange={(event) => updateDraft(section.id, { description: event.target.value })}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              {savedId === section.id ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" /> Saved
                </span>
              ) : null}

              <Button
                size="sm"
                onClick={() => handleSave(draft)}
                disabled={isPending || !dirty}
              >
                {isPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
                Save Section
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
