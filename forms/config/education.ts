import { CalendarDays, GraduationCap, School } from "lucide-react";
import { EDUCATION_LIMITS, educationSchema } from "@/forms/config/validations";
import type { FormConfig } from "@/forms/config/form";

export class EducationFormConfig {
  static formConfig(options?: { mode?: "create" | "edit" }): FormConfig {
    const isEdit = options?.mode === "edit";

    return {
      title: isEdit ? "Edit Education" : "Add Education",
      description: isEdit
        ? "Update this entry."
        : "Add a qualification to the education timeline.",
      icon: GraduationCap,
      columns: 2,
      submitLabel: isEdit ? "Save Changes" : "Add Education",
      pendingLabel: isEdit ? "Saving Changes..." : "Adding Education...",
      backHref: "/admin/education",
      backLabel: "Back to Education",
      inputs: [
        {
          name: "institution",
          label: "Institution",
          type: "text",
          icon: School,
          placeholder: "University of Example",
          isRequired: true,
          validation: educationSchema.shape.institution,
          maxLength: EDUCATION_LIMITS.institution,
          order: 1,
        },
        {
          name: "degree",
          label: "Degree",
          type: "text",
          placeholder: "B.Tech",
          validation: educationSchema.shape.degree,
          maxLength: EDUCATION_LIMITS.degree,
          order: 2,
        },
        {
          name: "field_of_study",
          label: "Field of Study",
          type: "text",
          placeholder: "Computer Science",
          validation: educationSchema.shape.field_of_study,
          maxLength: EDUCATION_LIMITS.fieldOfStudy,
          order: 3,
        },
        {
          name: "grade",
          label: "Grade / GPA",
          type: "text",
          placeholder: "8.7 CGPA",
          validation: educationSchema.shape.grade,
          maxLength: EDUCATION_LIMITS.grade,
          order: 4,
        },
        {
          name: "start_date",
          label: "Start Date",
          type: "date",
          icon: CalendarDays,
          validation: educationSchema.shape.start_date,
          order: 5,
        },
        {
          name: "end_date",
          label: "End Date",
          type: "date",
          icon: CalendarDays,
          validation: educationSchema.shape.end_date,
          order: 6,
        },
        {
          name: "display_order",
          label: "Sort Order",
          type: "number",
          placeholder: "0",
          helpText: "Lower numbers appear first.",
          validation: educationSchema.shape.display_order,
          min: 0,
          order: 7,
        },
        {
          name: "summary",
          label: "Summary",
          type: "textarea",
          rows: 3,
          placeholder: "Relevant coursework, honours, activities...",
          validation: educationSchema.shape.summary,
          maxLength: EDUCATION_LIMITS.summary,
          fullWidth: true,
          order: 8,
        },
      ],
      schema: educationSchema,
    };
  }
}
