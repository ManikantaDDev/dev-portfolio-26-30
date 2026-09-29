import { z } from "zod";
import { create } from "zustand";

type FormState<T> = {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  setFields: <K extends keyof T>(field: K, value: T[K]) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  validateForm: (schema: z.ZodType<T>) => boolean;
  resetForm: () => void;
};

export function createFormStore<T extends Record<string, unknown>>(
  initialData: T
) {
  return create<FormState<T>>((set, get) => ({
    data: initialData,
    errors: {},

    setFields: (field, value) =>
      set((state) => ({
        data: {
          ...state.data,
          [field]: value,
        },
        errors: {
          ...state.errors,
          [field]: undefined,
        },
      })),

    setErrors: (errors) => set({ errors }),

    validateForm: (schema) => {
      const result = schema.safeParse(get().data);

      if (result.success) {
        set({ errors: {} });
        return true;
      }

      const errors: Partial<Record<keyof T, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof T;

        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });

      set({ errors });

      return false;
    },

    resetForm: () => set({
      data: initialData,
      errors: {},
    }),
  }));
}