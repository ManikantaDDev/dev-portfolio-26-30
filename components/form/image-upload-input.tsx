"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlClassName } from "./form-styles";
import { useResolvedField } from "./use-form";

export type ImageUploadInputProps = {
  name?: string;
  value?: unknown;
  onValueChange?: (value: string | null) => void;
  upload?: (file: File) => Promise<string>;
  maxSizeMb?: number;
  accept?: string;
  disabled?: boolean;
  className?: string;
};

export function ImageUploadInput({
  name,
  value,
  onValueChange,
  upload,
  maxSizeMb = 5,
  accept = "image/*",
  disabled,
  className,
}: ImageUploadInputProps) {
  const field = useResolvedField(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isControlled = value !== undefined;
  const current = isControlled ? value : field.value;
  const url = current === null || current === undefined || current === "" ? null : String(current);
  const shown = preview ?? url;

  const commit = (next: string | null) => {
    if (onValueChange) {
      onValueChange(next);
    } else {
      field.onChange(next);
    }

    setPreview(null);
  };

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);

    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File must be smaller than ${maxSizeMb}MB.`);
      event.target.value = "";
      return;
    }

    setPreview(URL.createObjectURL(file));

    if (!upload) {
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      commit(await upload(file));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
      setPreview(null);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {shown ? (
        <div className="relative w-fit">
          <Image
            src={shown}
            alt="Selected preview"
            width={160}
            height={100}
            unoptimized
            className="h-24 w-40 rounded-md border object-cover"
          />

          <button
            type="button"
            onClick={() => commit(null)}
            disabled={disabled || uploading}
            aria-label="Remove image"
            className="absolute -right-2 -top-2 rounded-full bg-black p-1 text-white disabled:opacity-50"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled || uploading}
        onChange={handleFileChange}
        className={cn(controlClassName, "file:mr-3 file:rounded file:border-0 file:bg-black/5 file:px-2 file:py-1 file:text-sm")}
      />

      <input
        id={field.id}
        name={field.name}
        type="url"
        value={url ?? ""}
        onChange={(event) => commit(event.target.value === "" ? null : event.target.value)}
        onBlur={field.onBlur}
        placeholder="Or paste an image URL"
        aria-invalid={field.invalid || undefined}
        aria-describedby={field.describedBy}
        className={controlClassName}
      />

      {uploading ? <p className="text-xs text-muted-foreground">Uploading...</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
