import { z } from "zod";
import type { LucideIcon } from "lucide-react";

export type FormValues = Record<string, unknown>;

export type FormOption = {
  label: string;
  value: string;
  description?: string;
};

export type FormFieldCommon = {
  name: string;
  label: string;
  order?: number;
  isRequired?: boolean;
  validation?: z.ZodTypeAny;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  helpText?: string;
  autoComplete?: string;
  fullWidth?: boolean;
  /** Inline control rendered on the right of the label row. */
  action?: { label: string; onClick: () => void };
  /** Runs after the field value is written to the store. */
  onChange?: (value: unknown, values: FormValues) => void | Promise<void>;
};

export type TextInputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "date"
  | "time"
  | "tel"
  | "url";

export type TextInputConfig = FormFieldCommon & {
  type: TextInputType;
  icon?: LucideIcon;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
};

export type TextareaInputConfig = FormFieldCommon & {
  type: "textarea";
  icon?: LucideIcon;
  rows?: number;
  maxLength?: number;
};

export type SelectInputConfig = FormFieldCommon & {
  type: "select";
  icon?: LucideIcon;
  options: FormOption[];
};

export type RadioInputConfig = FormFieldCommon & {
  type: "radio";
  options: FormOption[];
  orientation?: "vertical" | "horizontal";
};

export type CheckboxInputConfig = FormFieldCommon & {
  type: "checkbox";
  description?: string;
};

export type FileInputConfig = FormFieldCommon & {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
};

export type FormInputConfig =
  | TextInputConfig
  | TextareaInputConfig
  | SelectInputConfig
  | RadioInputConfig
  | CheckboxInputConfig
  | FileInputConfig;

export type FormFooterLink = {
  text: string;
  linkLabel: string;
  href: string;
};

export type FormConfig = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  submitLabel?: string;
  pendingLabel?: string;
  cancelLabel?: string;
  backHref?: string;
  backLabel?: string;
  footer?: FormFooterLink;
  columns?: 1 | 2;
  inputs: FormInputConfig[];
  /** Whole-form schema. Overrides the schema derived from the input configs. */
  schema?: z.ZodTypeAny;
};

export function allInputs(config: FormConfig): FormInputConfig[] {
  return [...config.inputs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function numberSchema(field: FormFieldCommon) {
  const config = field as TextInputConfig;
  let schema = z.number({ error: `${field.label} must be a number` });

  if (config.min !== undefined) {
    schema = schema.min(config.min, `${field.label} must be at least ${config.min}`);
  }
  if (config.max !== undefined) {
    schema = schema.max(config.max, `${field.label} must be at most ${config.max}`);
  }

  return field.isRequired ? schema : schema.nullish();
}

function defaultSchema(field: FormInputConfig): z.ZodTypeAny {
  switch (field.type) {
    case "number":
      return numberSchema(field);
    case "checkbox":
      return field.isRequired
        ? z.boolean().refine(Boolean, { message: `${field.label} is required` })
        : z.boolean();
    case "select":
    case "radio":
      return field.isRequired
        ? z.string().trim().min(1, `${field.label} is required`)
        : z.string().optional();
    case "file":
      return field.isRequired
        ? z.custom<File>((value) => value instanceof File && value.size > 0, {
            message: `${field.label} is required`,
          })
        : z.custom<File | null>(() => true);
    default:
      return field.isRequired
        ? z.string().trim().min(1, `${field.label} is required`)
        : z.string().optional();
  }
}

/** Builds a zod object schema from the per-field validation configs. */
export function buildSchema(config: FormConfig) {
  if (config.schema) return config.schema;

  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of allInputs(config)) {
    shape[field.name] = field.validation ?? defaultSchema(field);
  }

  return z.object(shape);
}

export function fieldErrorsFromIssues(
  error: z.ZodError
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "");
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}