"use client";

import { useState } from "react";
import * as z from "zod";
import {
  DateInput,
  FormActions,
  FormDialog,
  FormField,
  FormGrid,
  FormMessage,
  FormProvider,
  FormSection,
  ImageUploadInput,
  NumberInput,
  SelectInput,
  SwitchInput,
  TagsInput,
  TextAreaInput,
  TextInput,
  UrlInput,
  useForm,
} from "@/components/form";
import type { Project } from "@/lib/demo/types";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Add a short description"),
  tags: z.array(z.string()),
  stars: z.number().min(0),
  publishedAt: z.date().nullable(),
  visibility: z.enum(["draft", "published"]),
  liveUrl: z.union([z.literal(""), z.url("Enter a valid URL")]),
  githubUrl: z.union([z.literal(""), z.url("Enter a valid URL")]),
  imageUrl: z.union([z.literal(""), z.url("Enter a valid URL")]),
  isFeatured: z.boolean(),
});

type ProjectValues = z.infer<typeof projectSchema>;

function toFormValues(project: Project | null): ProjectValues {
  return {
    title: project?.title ?? "",
    description: project?.description ?? "",
    tags: project?.tags ?? [],
    stars: project?.stars ?? 0,
    publishedAt: project?.publishedAt ?? null,
    visibility: project?.isPublished ? "published" : "draft",
    liveUrl: project?.liveUrl ?? "",
    githubUrl: project?.githubUrl ?? "",
    imageUrl: project?.imageUrl ?? "",
    isFeatured: false,
  };
}

export type ProjectEditorProps = {
  projects: Project[];
};

export function ProjectEditor({ projects }: ProjectEditorProps) {
  const [rows, setRows] = useState<Project[]>(projects);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const form = useForm<ProjectValues>({
    defaultValues: toFormValues(null),
    schema: projectSchema,
    validationMode: "onBlur",
    onSubmit: async (values) => {
      setRows((current) => {
        if (editing) {
          return current.map((row) =>
            row.id === editing.id
              ? {
                  ...row,
                  title: values.title,
                  description: values.description,
                  tags: values.tags,
                  stars: values.stars,
                  isPublished: values.visibility === "published",
                  liveUrl: values.liveUrl === "" ? null : values.liveUrl,
                  githubUrl: values.githubUrl === "" ? null : values.githubUrl,
                }
              : row,
          );
        }

        const next: Project = {
          id: `p${Date.now()}`,
          title: values.title,
          description: values.description,
          tags: values.tags,
          stars: values.stars,
          isPublished: values.visibility === "published",
          liveUrl: values.liveUrl === "" ? null : values.liveUrl,
          githubUrl: values.githubUrl === "" ? null : values.githubUrl,
        };

        return [...current, next];
      });

      setSaved(values.title);
      setOpen(false);
    },
  });

  function handleCreate() {
    setEditing(null);
    form.reset(toFormValues(null));
    setSaved(null);
    setOpen(true);
  }

  function handleEdit(project: Project) {
    setEditing(project);
    form.reset(toFormValues(project));
    setSaved(null);
    setOpen(true);
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Demo only — changes are held in memory and reset on reload.
        </p>

        <button
          type="button"
          onClick={handleCreate}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          New project
        </button>
      </div>

      <FormMessage
        tone={form.submitError ? "error" : "success"}
        className="mt-4"
      >
        {form.submitError ?? (saved ? `Saved “${saved}”.` : null)}
      </FormMessage>

      <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-background">
        {rows.map((project) => (
          <li
            key={project.id}
            className="flex flex-wrap items-center justify-between gap-4 p-5"
          >
            <div className="min-w-0">
              <p className="font-medium">{project.title}</p>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                {project.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={
                  project.isPublished
                    ? "rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700"
                    : "rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                }
              >
                {project.isPublished ? "Published" : "Draft"}
              </span>

              <button
                type="button"
                onClick={() => handleEdit(project)}
                className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Edit ${editing.title}` : "New project"}
        description="Fields map to the projects table."
      >
        <FormProvider form={form}>
          <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
            <FormGrid columns={2}>
              <FormField name="title" label="Title" required>
                <TextInput placeholder="Project title" />
              </FormField>

              <FormField name="visibility" label="Visibility" required>
                <SelectInput
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Published", value: "published" },
                  ]}
                />
              </FormField>
            </FormGrid>

            <FormField name="description" label="Description" required>
              <TextAreaInput rows={4} placeholder="What does it do?" />
            </FormField>

            <FormField name="tags" label="Tags" hint="Press Enter to add each tag">
              <TagsInput maxTags={6} />
            </FormField>

            <FormGrid columns={2}>
              <FormField name="liveUrl" label="Live URL">
                <UrlInput />
              </FormField>

              <FormField name="githubUrl" label="Source URL">
                <UrlInput />
              </FormField>
            </FormGrid>

            <FormGrid columns={2}>
              <FormField name="stars" label="Stars">
                <NumberInput min={0} max={100000} />
              </FormField>

              <FormField name="publishedAt" label="Published at">
                <DateInput dateType="date" />
              </FormField>
            </FormGrid>

            <FormSection title="Extras" className="bg-muted/20">
              <FormField name="imageUrl" label="Cover image">
                <ImageUploadInput maxSizeMb={2} />
              </FormField>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Featured</p>
                  <p className="text-xs text-muted-foreground">
                    Highlight this project on the public page.
                  </p>
                </div>

                <SwitchInput name="isFeatured" />
              </div>
            </FormSection>

            <FormActions
              submitLabel={editing ? "Save changes" : "Create project"}
              loadingLabel="Saving..."
              showReset
              onCancel={() => setOpen(false)}
            />
          </form>
        </FormProvider>
      </FormDialog>
    </>
  );
}
