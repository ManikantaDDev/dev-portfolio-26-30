import { Code, ExternalLink, FolderGit2, Image as ImageIcon, Tags } from "lucide-react";
import { PROJECT_LIMITS, projectSchema } from "@/forms/config/validations";
import type { FormConfig } from "@/forms/config/form";

export class ProjectFormConfig {
  static formConfig(options?: { mode?: "create" | "edit" }): FormConfig {
    const isEdit = options?.mode === "edit";

    return {
      title: isEdit ? "Edit Project" : "Add Project",
      description: isEdit
        ? "Update this project. Unpublished projects stay hidden from visitors."
        : "Add a project to your portfolio.",
      icon: FolderGit2,
      columns: 2,
      submitLabel: isEdit ? "Save Changes" : "Add Project",
      pendingLabel: isEdit ? "Saving Changes..." : "Adding Project...",
      backHref: "/admin/projects",
      backLabel: "Back to Projects",
      inputs: [
        {
          name: "title",
          label: "Title",
          type: "text",
          placeholder: "Realtime Notes",
          isRequired: true,
          validation: projectSchema.shape.title,
          maxLength: PROJECT_LIMITS.title,
          order: 1,
        },
        {
          name: "display_order",
          label: "Sort Order",
          type: "number",
          placeholder: "0",
          helpText: "Lower numbers appear first.",
          validation: projectSchema.shape.display_order,
          min: 0,
          order: 2,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          rows: 4,
          placeholder: "What does this project do?",
          validation: projectSchema.shape.description,
          maxLength: PROJECT_LIMITS.description,
          fullWidth: true,
          order: 3,
        },
        {
          name: "tags",
          label: "Tags",
          type: "text",
          icon: Tags,
          placeholder: "React, Postgres, Tailwind",
          helpText: "Separate tags with commas.",
          validation: projectSchema.shape.tags,
          maxLength: PROJECT_LIMITS.tags,
          order: 4,
        },
        {
          name: "image_url",
          label: "Image URL",
          type: "url",
          icon: ImageIcon,
          placeholder: "https://example.com/preview.png",
          validation: projectSchema.shape.image_url,
          order: 5,
        },
        {
          name: "live_url",
          label: "Live URL",
          type: "url",
          icon: ExternalLink,
          placeholder: "https://example.com",
          validation: projectSchema.shape.live_url,
          order: 6,
        },
        {
          name: "github_url",
          label: "Repository URL",
          type: "url",
          icon: Code,
          placeholder: "https://github.com/username/project",
          validation: projectSchema.shape.github_url,
          order: 7,
        },
        {
          name: "is_published",
          label: "Published",
          description: "Published projects are visible on your public portfolio.",
          type: "checkbox",
          validation: projectSchema.shape.is_published,
          order: 8,
        },
        {
          name: "is_featured",
          label: "Featured",
          description: "Mark standout projects as featured.",
          type: "checkbox",
          validation: projectSchema.shape.is_featured,
          order: 9,
        },
      ],
      schema: projectSchema,
    };
  }
}
