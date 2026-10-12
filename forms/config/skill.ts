import { Clock, Layers, Sparkles, Tags } from "lucide-react";
import {
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SKILL_LIMITS,
  skillSchema,
} from "@/forms/config/validations";
import type { FormConfig } from "@/forms/config/form";

export class SkillFormConfig {
  static formConfig(options?: { mode?: "create" | "edit" }): FormConfig {
    const isEdit = options?.mode === "edit";

    return {
      title: isEdit ? "Edit Skill" : "Add Skill",
      description: isEdit
        ? "Update this skill's details."
        : "Add a skill to your portfolio profile.",
      icon: Sparkles,
      columns: 2,
      submitLabel: isEdit ? "Save Changes" : "Add Skill",
      pendingLabel: isEdit ? "Saving Changes..." : "Adding Skill...",
      backHref: "/admin/skills",
      backLabel: "Back to Skills",
      inputs: [
        {
          name: "name",
          label: "Skill",
          type: "text",
          icon: Tags,
          placeholder: "React",
          isRequired: true,
          validation: skillSchema.shape.name,
          maxLength: SKILL_LIMITS.name,
          order: 1,
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          icon: Layers,
          placeholder: "Select a category",
          isRequired: true,
          validation: skillSchema.shape.category,
          options: SKILL_CATEGORIES.map((value) => ({ label: value, value })),
          order: 2,
        },
        {
          name: "level",
          label: "Proficiency",
          type: "select",
          placeholder: "Select a proficiency level",
          isRequired: true,
          validation: skillSchema.shape.level,
          options: SKILL_LEVELS.map((value) => ({ label: value, value })),
          order: 3,
        },
        {
          name: "years",
          label: "Years of Experience",
          type: "number",
          icon: Clock,
          placeholder: "3",
          helpText: "Leave blank if not applicable.",
          validation: skillSchema.shape.years,
          min: 0,
          max: SKILL_LIMITS.years,
          order: 4,
        },
        {
          name: "is_featured",
          label: "Featured",
          description: "Highlight this skill on your portfolio homepage.",
          type: "checkbox",
          fullWidth: true,
          validation: skillSchema.shape.is_featured,
          order: 5,
        },
      ],
      schema: skillSchema,
    };
  }
}