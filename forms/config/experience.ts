import { Building, CalendarDays, MapPin, Briefcase } from "lucide-react";
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LIMITS,
  experienceSchema,
} from "@/forms/config/validations";
import type { FormConfig } from "@/forms/config/form";

export class ExperienceFormConfig {
  static formConfig(options?: { mode?: "create" | "edit" }): FormConfig {
    const isEdit = options?.mode === "edit";

    return {
      title: isEdit ? "Edit Experience" : "Add Experience",
      description: isEdit
        ? "Update this role."
        : "Add a role to the experience timeline on your portfolio.",
      icon: Briefcase,
      columns: 2,
      submitLabel: isEdit ? "Save Changes" : "Add Experience",
      pendingLabel: isEdit ? "Saving Changes..." : "Adding Experience...",
      backHref: "/admin/experience",
      backLabel: "Back to Experience",
      inputs: [
        {
          name: "company",
          label: "Company",
          type: "text",
          icon: Building,
          placeholder: "Northwind Labs",
          isRequired: true,
          validation: experienceSchema.shape.company,
          maxLength: EXPERIENCE_LIMITS.company,
          order: 1,
        },
        {
          name: "title",
          label: "Role",
          type: "text",
          placeholder: "Senior Software Engineer",
          isRequired: true,
          validation: experienceSchema.shape.title,
          maxLength: EXPERIENCE_LIMITS.title,
          order: 2,
        },
        {
          name: "employment_type",
          label: "Employment Type",
          type: "select",
          placeholder: "Select a type",
          validation: experienceSchema.shape.employment_type,
          options: EMPLOYMENT_TYPES.map((value) => ({ label: value, value })),
          order: 3,
        },
        {
          name: "location",
          label: "Location",
          type: "text",
          icon: MapPin,
          placeholder: "Remote",
          validation: experienceSchema.shape.location,
          maxLength: EXPERIENCE_LIMITS.location,
          order: 4,
        },
        {
          name: "start_date",
          label: "Start Date",
          type: "date",
          icon: CalendarDays,
          validation: experienceSchema.shape.start_date,
          order: 5,
        },
        {
          name: "end_date",
          label: "End Date",
          type: "date",
          icon: CalendarDays,
          helpText: "Ignored while this role is marked as current.",
          validation: experienceSchema.shape.end_date,
          order: 6,
        },
        {
          name: "display_order",
          label: "Sort Order",
          type: "number",
          placeholder: "0",
          helpText: "Lower numbers appear first.",
          validation: experienceSchema.shape.display_order,
          min: 0,
          order: 7,
        },
        {
          name: "is_current",
          label: "Current Role",
          description: "I currently work here.",
          type: "checkbox",
          validation: experienceSchema.shape.is_current,
          order: 8,
        },
        {
          name: "summary",
          label: "Summary",
          type: "textarea",
          rows: 4,
          placeholder: "What did you work on?",
          validation: experienceSchema.shape.summary,
          maxLength: EXPERIENCE_LIMITS.summary,
          fullWidth: true,
          order: 9,
        },
      ],
      schema: experienceSchema,
    };
  }
}
