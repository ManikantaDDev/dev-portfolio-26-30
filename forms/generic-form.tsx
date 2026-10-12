"use client";

import {
  useMemo,
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  allInputs,
  buildSchema,
  fieldErrorsFromIssues,
  type FormConfig,
  type FormFieldCommon,
  type FormInputConfig,
  type FormValues,
} from "./config/form";
import { formStores, type FormKey } from "./stores";
import type { FormState } from "@/lib/backend/stores/genericStore";

export type FormStoreHook<T extends FormValues> = (() => FormState<T>) & {
  getState: () => FormState<T>;
};

export type SubmitResult = {
  error?: string;
  message?: string;
  redirectTo?: string;
};

export type GenericFormProps<T extends FormValues> = {
  formKey: FormKey;
  config: FormConfig;
  onSubmit?: (values: T) => Promise<SubmitResult | void>;
  action?: (values: T) => Promise<SubmitResult | void>;
  /** Merged into the store on first render (e.g. server-provided values). */
  initialValues?: Partial<T>;
  initialError?: string | null;
  onCancel?: () => void;
  className?: string;
};

export default function GenericForm<T extends FormValues>({
  formKey,
  config,
  onSubmit,
  action,
  initialValues,
  initialError = null,
  onCancel,
  className,
}: GenericFormProps<T>) {
  const useStore = formStores[formKey] as unknown as FormStoreHook<T>;
  const { data, errors, setFields, setErrors } = useStore();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  useState(() => {
    if (initialValues) useStore.getState().setForm(initialValues);
  });

  const router = useRouter();
  const schema = useMemo(() => buildSchema(config), [config]);
  const inputs = useMemo(() => allInputs(config), [config]);
  const Icon = config.icon;

  function handleFieldChange(field: FormInputConfig, value: unknown) {
    setFields(field.name as never, value as never);

    if (errorMessage) setErrorMessage(null);
    if (infoMessage) setInfoMessage(null);

    const values = useStore.getState().data as FormValues;
    void field.onChange?.(value, values);
  }

  function handleTextChange(field: FormInputConfig, event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    const value = field.type === "number" ? (raw === "" ? null : Number(raw)) : raw;
    handleFieldChange(field, value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setErrors({} as Partial<Record<keyof T, string>>);

    const values = useStore.getState().data;
    const result = schema.safeParse(values);

    if (!result.success) {
      setErrors(fieldErrorsFromIssues(result.error) as Partial<Record<keyof T, string>>);
      return;
    }

    startTransition(async () => {
      try {
        const submit = action ?? onSubmit;
        if (!submit) return;

        const response = await submit(result.data as T);

        if (response?.error) {
          setErrorMessage(response.error);
          return;
        }

        if (response?.redirectTo) {
          router.refresh();
          router.push(response.redirectTo);
          return;
        }

        if (response?.message) {
          setInfoMessage(response.message);
        }
      } catch (err: unknown) {
        setErrorMessage(
          err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
        );
      }
    });
  }

  function renderField(field: FormInputConfig) {
    const fieldError = errors[field.name as keyof T] as string | undefined;
    const value = data[field.name];
    const isInlineLabel = field.type === "checkbox";

    return (
      <div
        key={field.name}
        className={field.fullWidth || config.columns !== 2 ? "w-full" : undefined}
      >
        <div className="space-y-2">
          {!isInlineLabel ? (
            <div className="flex items-center justify-between">
              <Label htmlFor={field.name}>
                {field.label}
                {field.isRequired ? (
                  <span aria-hidden="true" className="text-destructive">
                    *
                  </span>
                ) : null}
              </Label>

              {field.action ? (
                <button
                  type="button"
                  onClick={field.action.onClick}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {field.action.label}
                </button>
              ) : null}
            </div>
          ) : null}

          {renderControl(field, value, fieldError)}

          {field.helpText ? (
            <p className="text-xs text-muted-foreground">{field.helpText}</p>
          ) : null}

          {fieldError ? (
            <p role="alert" className="text-xs text-destructive">
              {fieldError}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  function renderControl(field: FormInputConfig, value: unknown, fieldError?: string) {
    const invalid = fieldError ? true : undefined;
    const isDisabled = field.disabled || isPending;

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.name}
            name={field.name}
            rows={field.rows ?? 4}
            required={field.isRequired}
            placeholder={field.placeholder}
            disabled={isDisabled}
            maxLength={field.maxLength}
            value={(value as string) ?? ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            aria-invalid={invalid}
          />
        );

      case "select":
        return (
          <Select
            name={field.name}
            value={(value as string) ?? ""}
            onValueChange={(next) => handleFieldChange(field, next ?? "")}
            disabled={isDisabled}
          >
            <SelectTrigger
              id={field.name}
              className="w-full"
              aria-invalid={invalid}
            >
              <SelectValue placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={(value as string) ?? ""}
            onValueChange={(next) => handleFieldChange(field, next)}
            disabled={isDisabled}
            className={field.orientation === "horizontal" ? "flex flex-wrap gap-4" : undefined}
            aria-invalid={invalid}
          >
            {field.options.map((option) => (
              <Label
                key={option.value}
                className="flex w-fit items-center gap-2 font-normal"
              >
                <RadioGroupItem value={option.value} />
                {option.label}
              </Label>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <Label className="flex w-fit items-start gap-2 font-normal">
            <Checkbox
              id={field.name}
              name={field.name}
              checked={Boolean(value)}
              onCheckedChange={(checked) => handleFieldChange(field, Boolean(checked))}
              disabled={isDisabled}
            />
            <span className="flex flex-col gap-0.5">
              <span>{field.description ?? field.label}</span>
            </span>
          </Label>
        );

      case "file":
        return (
          <FileControl
            field={field}
            value={value as File | File[] | null}
            disabled={isDisabled}
            onChange={(files) => handleFieldChange(field, files)}
          />
        );

      default: {
        const isPassword = field.type === "password";
        const FieldIcon = field.icon;
        const isRevealed = revealed[field.name] ?? false;

        return (
          <div className="relative">
            <Input
              id={field.name}
              name={field.name}
              type={isPassword && isRevealed ? "text" : field.type}
              required={field.isRequired}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              disabled={isDisabled}
              readOnly={field.readOnly}
              minLength={field.minLength}
              maxLength={field.maxLength}
              min={field.min}
              max={field.max}
              step={field.step}
              value={(value as string | number | null) ?? ""}
              onChange={(e) => handleTextChange(field, e)}
              aria-invalid={invalid}
              className={Icon ? "pl-9" : undefined}
            />
            {FieldIcon ? (
              <FieldIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            ) : null}
            {isPassword ? (
              <button
                type="button"
                aria-label={isRevealed ? `Hide ${field.label}` : `Show ${field.label}`}
                onClick={() =>
                  setRevealed((prev) => ({ ...prev, [field.name]: !prev[field.name] }))
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                tabIndex={-1}
              >
                {isRevealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            ) : null}
          </div>
        );
      }
    }
  }

  return (
    <Card className={`w-full max-w-md shadow-lg border-border/80 ${className ?? ""}`}>
      <CardHeader className="space-y-1.5 pb-4">
        <div className="flex items-center justify-between">
          {config.backHref ? (
            <Link
              href={config.backHref}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              {config.backLabel ?? "Back"}
            </Link>
          ) : (
            <span />
          )}
          {Icon ? (
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-4" />
            </div>
          ) : null}
        </div>

        <CardTitle className="text-2xl font-bold tracking-tight">{config.title}</CardTitle>
        {config.description ? (
          <CardDescription className="text-sm">{config.description}</CardDescription>
        ) : null}
      </CardHeader>

      <CardContent>
        {errorMessage ? (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        ) : null}

        {infoMessage ? (
          <div
            role="status"
            className="mb-4 flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <p className="leading-snug">{infoMessage}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div
            className={
              config.columns === 2 ? "grid gap-4 sm:grid-cols-2" : "flex flex-col gap-4"
            }
          >
            {inputs.map(renderField)}
          </div>

          <Button type="submit" className="w-full font-medium" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {config.pendingLabel ?? config.submitLabel ?? "Submitting..."}
              </>
            ) : (
              config.submitLabel ?? "Submit"
            )}
          </Button>

          {config.cancelLabel && onCancel ? (
            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs text-muted-foreground hover:text-foreground"
              onClick={onCancel}
              disabled={isPending}
            >
              {config.cancelLabel}
            </Button>
          ) : null}
        </form>
      </CardContent>

      {config.footer ? (
        <CardFooter className="flex flex-col gap-2 border-t border-border/50 pt-2 text-center text-xs text-muted-foreground">
          <div>
            {config.footer.text}{" "}
            <Link
              href={config.footer.href}
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              {config.footer.linkLabel}
            </Link>
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}

function FileControl({
  field,
  value,
  disabled,
  onChange,
}: {
  field: FormFieldCommon & { accept?: string; multiple?: boolean; maxSizeMB?: number };
  value: File | File[] | null;
  disabled?: boolean;
  onChange: (files: File | File[] | null) => void;
}) {
  const files = value ? (Array.isArray(value) ? value : [value]) : [];

  return (
    <div className="space-y-2">
      <label
        htmlFor={field.name}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input px-3 py-4 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
      >
        <Upload className="size-4" />
        {files.length ? `${files.length} file(s) selected` : "Click to upload"}
      </label>
      <input
        id={field.name}
        name={field.name}
        type="file"
        className="sr-only"
        accept={field.accept}
        multiple={field.multiple}
        disabled={disabled}
        onChange={(e) => onChange(Array.from(e.target.files ?? []))}
      />
      {files.map((file) => (
        <div
          key={file.name}
          className="flex items-center justify-between gap-2 rounded-lg border border-border px-2.5 py-1.5 text-xs"
        >
          <span className="truncate">{file.name}</span>
          <button
            type="button"
            aria-label={`Remove ${file.name}`}
            onClick={() =>
              onChange(
                (Array.isArray(value) ? value : [value]).filter((item) => item !== file) as File[]
              )
            }
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}