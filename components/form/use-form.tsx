"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { ZodError, ZodType } from "zod";

export type FieldValues = Record<string, unknown>;

export type FormErrors = Record<string, string>;

export type ValidationMode = "onChange" | "onBlur" | "onSubmit";

export type UseFormOptions<T extends FieldValues> = {
  defaultValues: T;
  schema?: ZodType<T>;
  validationMode?: ValidationMode;
  onSubmit?: (values: T, helpers: SubmitHelpers) => void | Promise<void>;
  onError?: (errors: FormErrors) => void;
};

export type SubmitHelpers = {
  reset: () => void;
  setSubmitError: (message: string | null) => void;
};

export type FieldMeta = {
  id: string;
  name: string;
  value: unknown;
  error: string | undefined;
  invalid: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
};

export type InjectedFieldMeta = FieldMeta & {
  describedBy: string | undefined;
};

export type UseFormReturnBase = {
  formId: string;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
  getField: (name: string) => FieldMeta;
  setValue: (name: string, value: unknown) => void;
  setError: (name: string, message: string) => void;
  clearError: (name: string) => void;
  clearErrors: () => void;
  reset: () => void;
  resetField: (name: string) => void;
  handleChange: (name: string, value: unknown) => void;
  handleBlur: (name: string) => void;
  handleFocus: (name: string) => void;
  handleSubmit: (event?: FormEvent<HTMLFormElement>) => Promise<void>;
};

export type UseFormReturn<T extends FieldValues> = {
  formId: string;
  values: T;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
  getField: (name: string) => FieldMeta;
  setValue: (name: string, value: unknown) => void;
  setValues: (patch: Partial<T>) => void;
  setError: (name: string, message: string) => void;
  clearError: (name: string) => void;
  clearErrors: () => void;
  reset: (values?: T) => void;
  resetField: (name: string) => void;
  handleChange: (name: string, value: unknown) => void;
  handleBlur: (name: string) => void;
  handleFocus: (name: string) => void;
  handleSubmit: (event?: FormEvent<HTMLFormElement>) => Promise<void>;
};

function toPathKey(path: readonly PropertyKey[]): string {
  return path.map((segment) => String(segment)).join(".");
}

function collectIssues(error: ZodError): FormErrors {
  const errors: FormErrors = {};

  for (const issue of error.issues) {
    const key = toPathKey(issue.path);

    if (key.length > 0 && errors[key] === undefined) {
      errors[key] = issue.message;
    }
  }

  return errors;
}

function lookupError(errors: FormErrors, name: string): string | undefined {
  if (errors[name] !== undefined) {
    return errors[name];
  }

  const nested = Object.keys(errors).find((key) => key.startsWith(`${name}.`));

  return nested === undefined ? undefined : errors[nested];
}

function getAtPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current === null || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, source);
}

function setAtPath<T extends FieldValues>(source: T, path: string, value: unknown): T {
  const segments = path.split(".");
  const root: Record<string, unknown> = { ...source };

  let cursor = root;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    const child = cursor[segment];
    const nextChild =
      child !== null && typeof child === "object" && !Array.isArray(child)
        ? { ...(child as Record<string, unknown>) }
        : {};

    cursor[segment] = nextChild;
    cursor = nextChild as Record<string, unknown>;
  }

  cursor[segments[segments.length - 1]] = value;

  return root as T;
}

function isEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }

  if (left instanceof Date && right instanceof Date) {
    return left.getTime() === right.getTime();
  }

  if (
    typeof left !== "object" ||
    typeof right !== "object" ||
    left === null ||
    right === null
  ) {
    return false;
  }

  if (Array.isArray(left) !== Array.isArray(right)) {
    return false;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(right, key) &&
      isEqual(
        (left as Record<string, unknown>)[key],
        (right as Record<string, unknown>)[key],
      ),
  );
}

export function useForm<T extends FieldValues>({
  defaultValues,
  schema,
  validationMode = "onSubmit",
  onSubmit,
  onError,
}: UseFormOptions<T>): UseFormReturn<T> {
  const reactId = useId();
  const formId = `form-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const [values, applyValues] = useState<T>(defaultValues);
  const [initialValues, setInitialValues] = useState<T>(defaultValues);
  const [overrides, setOverrides] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schemaErrors = useMemo<FormErrors>(() => {
    if (!schema) {
      return {};
    }

    const result = schema.safeParse(values);

    return result.success ? {} : collectIssues(result.error as ZodError);
  }, [schema, values]);

  const errors = useMemo<FormErrors>(() => {
    const validateAll = isSubmitted || validationMode === "onChange";
    const next: FormErrors = {};

    for (const [key, message] of Object.entries(schemaErrors)) {
      if (validateAll || touched[key]) {
        next[key] = message;
      }
    }

    for (const [key, message] of Object.entries(overrides)) {
      if (message === null) {
        delete next[key];
      } else {
        next[key] = message;
      }
    }

    return next;
  }, [isSubmitted, overrides, schemaErrors, touched, validationMode]);

  const handleChange = useCallback((name: string, value: unknown) => {
    applyValues((current) => setAtPath(current, name, value));
  }, []);

  const handleBlur = useCallback((name: string) => {
    setTouched((current) =>
      current[name] === true ? current : { ...current, [name]: true },
    );
  }, []);

  const handleFocus = useCallback((name: string) => {
    setTouched((current) =>
      current[name] === true ? current : { ...current, [name]: false },
    );
  }, []);

  const setValue = useCallback((name: string, value: unknown) => {
    handleChange(name, value);
  }, [handleChange]);

  const setValues = useCallback((patch: Partial<T>) => {
    applyValues((current) => ({ ...current, ...patch }));
  }, []);

  const setError = useCallback((name: string, message: string) => {
    setOverrides((current) => ({ ...current, [name]: message }));
  }, []);

  const clearError = useCallback((name: string) => {
    setOverrides((current) => ({ ...current, [name]: null }));
  }, []);

  const clearErrors = useCallback(() => {
    setOverrides({});
    setSubmitError(null);
  }, []);

  const reset = useCallback(
    (nextValues?: T) => {
      const target = nextValues ?? initialValues;

      if (nextValues) {
        setInitialValues(nextValues);
      }

      applyValues(target);
      setOverrides({});
      setTouched({});
      setIsSubmitted(false);
      setSubmitError(null);
    },
    [initialValues],
  );

  const resetField = useCallback(
    (name: string) => {
      applyValues((current) =>
        setAtPath(current, name, getAtPath(initialValues, name)),
      );
      clearError(name);
    },
    [clearError, initialValues],
  );

  const getField = useCallback(
    (name: string): FieldMeta => {
      const error = lookupError(errors, name);

      return {
        id: `${formId}-${name.replace(/[^a-zA-Z0-9_-]/g, "-")}`,
        name,
        value: getAtPath(values, name),
        error,
        invalid: error !== undefined,
        onChange: (value: unknown) => handleChange(name, value),
        onBlur: () => handleBlur(name),
        onFocus: () => handleFocus(name),
      };
    },
    [errors, formId, handleBlur, handleChange, handleFocus, values],
  );

  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      setIsSubmitted(true);

      if (Object.keys(schemaErrors).length > 0) {
        onError?.(schemaErrors);
        return;
      }

      if (!onSubmit) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await onSubmit(values, { reset, setSubmitError });
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [onError, onSubmit, reset, schemaErrors, values],
  );

  const isDirty = useMemo(() => !isEqual(values, initialValues), [initialValues, values]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return {
    formId,
    values,
    errors,
    touched,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    submitError,
    getField,
    setValue,
    setValues,
    setError,
    clearError,
    clearErrors,
    reset,
    resetField,
    handleChange,
    handleBlur,
    handleFocus,
    handleSubmit,
  };
}

export const FormContext = createContext<UseFormReturnBase | null>(null);

export function FormProvider<T extends FieldValues>({
  form,
  children,
}: {
  form: UseFormReturn<T>;
  children: ReactNode;
}) {
  const { values: _values, setValues: _setValues, ...base } = form;

  void _values;
  void _setValues;

  return <FormContext.Provider value={base}>{children}</FormContext.Provider>;
}

export function useFormContext(): UseFormReturnBase {
  const form = useContext(FormContext);

  if (!form) {
    throw new Error("useFormContext must be used inside a <FormProvider>.");
  }

  return form;
}

export const FieldContext = createContext<InjectedFieldMeta | null>(null);

export function useResolvedField(name?: string): InjectedFieldMeta {
  const injected = useContext(FieldContext);
  const form = useContext(FormContext);

  if (injected) {
    return injected;
  }

  if (!name) {
    throw new Error(
      "A field name is required when the input is not wrapped in a <FormField>.",
    );
  }

  if (!form) {
    throw new Error("useResolvedField must be used inside a <FormProvider>.");
  }

  return { ...form.getField(name), describedBy: undefined };
}
