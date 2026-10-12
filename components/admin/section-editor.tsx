"use client";

import { useState } from "react";
import * as z from "zod";
import {
  FormActions,
  FormField,
  FormGrid,
  FormMessage,
  FormProvider,
  FormSection,
  NumberInput,
  SwitchInput,
  TextInput,
  useForm,
} from "@/components/form";
import type { Section } from "@/lib/demo/types";

const sectionSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title is required"),
  displayOrder: z.number().min(0),
  isVisible: z.boolean(),
});

type SectionValues = z.infer<typeof sectionSchema>;

export function SectionEditor({ sections }: { sections: Section[] }) {
  const [rows, setRows] = useState<Section[]>(sections);
  const [saved, setSaved] = useState<string | null>(null);

  const form = useForm<SectionValues>({
    defaultValues: { name: "", title: "", displayOrder: 0, isVisible: true },
    schema: sectionSchema,
    onSubmit: (values) => {
      setRows((current) =>
        [...current, { ...values }].sort((a, b) => a.displayOrder - b.displayOrder),
      );

      setSaved(values.title);
      form.reset();
    },
  });

  return (
    <>
      <FormProvider form={form}>
        <form onSubmit={form.handleSubmit} noValidate>
          <FormSection
            title="Add a section"
            description="Controls which blocks appear on the public portfolio."
          >
            <FormGrid columns={3}>
              <FormField name="name" label="Key" required hint="Used as the anchor id">
                <TextInput placeholder="projects" />
              </FormField>

              <FormField name="title" label="Title" required>
                <TextInput placeholder="Projects" />
              </FormField>

              <FormField name="displayOrder" label="Order" required>
                <NumberInput min={0} max={99} />
              </FormField>
            </FormGrid>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Visible</p>
                <p className="text-xs text-muted-foreground">
                  Hidden sections are skipped on the public page.
                </p>
              </div>

              <SwitchInput name="isVisible" />
            </div>

            <FormMessage tone={form.submitError ? "error" : "success"}>
              {form.submitError ?? (saved ? `Added “${saved}”.` : null)}
            </FormMessage>

            <FormActions submitLabel="Add section" loadingLabel="Adding..." />
          </FormSection>
        </form>
      </FormProvider>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-background">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Title
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Key
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Order
              </th>
              <th scope="col" className="px-4 py-3 text-center font-medium">
                Visible
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((section) => (
              <tr key={section.name} className="border-t">
                <td className="px-4 py-3 font-medium">{section.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{section.name}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {section.displayOrder}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      setRows((current) =>
                        current.map((row) =>
                          row.name === section.name
                            ? { ...row, isVisible: !row.isVisible }
                            : row,
                        ),
                      )
                    }
                    aria-pressed={section.isVisible}
                    className={
                      section.isVisible
                        ? "rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700"
                        : "rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {section.isVisible ? "Visible" : "Hidden"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
