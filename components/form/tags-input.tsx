"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlClassName } from "./form-styles";
import { useResolvedField } from "./use-form";

export type TagsInputProps = {
  name?: string;
  value?: unknown;
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  disabled?: boolean;
  className?: string;
};

function toTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag)).filter((tag) => tag.length > 0);
  }

  if (typeof value === "string" && value.length > 0) {
    return value.split(",").map((tag) => tag.trim()).filter(Boolean);
  }

  return [];
}

export function TagsInput({
  name,
  value,
  onValueChange,
  placeholder = "Add a tag and press Enter",
  maxTags,
  allowDuplicates = false,
  disabled,
  className,
}: TagsInputProps) {
  const field = useResolvedField(name);
  const [draft, setDraft] = useState("");

  const isControlled = value !== undefined;
  const tags = toTags(isControlled ? value : field.value);

  const commit = (next: string[]) => {
    if (onValueChange) {
      onValueChange(next);
    } else {
      field.onChange(next);
    }
  };

  const addTag = (raw: string) => {
    const candidates = raw
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (candidates.length === 0) {
      return;
    }

    const next = [...tags];

    for (const candidate of candidates) {
      if (maxTags !== undefined && next.length >= maxTags) {
        break;
      }

      if (!allowDuplicates && next.includes(candidate)) {
        continue;
      }

      next.push(candidate);
    }

    if (next.length !== tags.length) {
      commit(next);
    }
  };

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
      setDraft("");
      return;
    }

    if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      commit(tags.slice(0, -1));
    }
  }

  const isFull = maxTags !== undefined && tags.length >= maxTags;

  return (
    <div className={cn("space-y-2", className)}>
      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-sm"
            >
              {tag}

              <button
                type="button"
                aria-label={`Remove ${tag}`}
                disabled={disabled}
                onClick={() => commit(tags.filter((item) => item !== tag))}
                className="text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        id={field.id}
        name={field.name}
        type="text"
        value={draft}
        disabled={disabled || isFull}
        placeholder={isFull ? "Tag limit reached" : placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={(event) => {
          addTag(draft);
          setDraft("");
          field.onBlur();
          field.onFocus();
          void event;
        }}
        aria-invalid={field.invalid || undefined}
        aria-describedby={field.describedBy}
        className={cn(controlClassName, (disabled || isFull) && "cursor-not-allowed opacity-60")}
      />
    </div>
  );
}
