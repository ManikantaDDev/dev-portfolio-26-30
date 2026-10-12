"use client";

import type { Column } from "@/features/admin/record-editor";
import RecordEditor from "@/features/admin/record-editor";
import { deleteExperienceAction, saveExperienceAction } from "@/actions/experience";
import {
  emptyExperienceValues,
  type ExperienceFormValues,
} from "@/forms/config/validations";
import type { ExperienceRow } from "@/types/database";

function formatRange(row: ExperienceRow): string {
  const start = row.start_date ? row.start_date.slice(0, 7) : null;
  const end = row.is_current ? "Present" : row.end_date?.slice(0, 7) ?? null;

  if (!start && !end) return "\u2014";

  return `${start ?? "\u2014"} \u2014 ${end ?? "\u2014"}`;
}

const columns: Column<ExperienceRow>[] = [
  {
    header: "Role",
    render: (experience) => (
      <div className="min-w-0">
        <p className="truncate font-medium">{experience.title}</p>
        <p className="truncate text-xs text-muted-foreground">{experience.company}</p>
      </div>
    ),
  },
  {
    header: "Period",
    render: (experience) => (
      <span className="text-muted-foreground">{formatRange(experience)}</span>
    ),
  },
  {
    header: "Type",
    render: (experience) => (
      <span className="text-muted-foreground">
        {experience.employment_type ?? "\u2014"}
      </span>
    ),
  },
];

export function ExperienceManager({ rows }: { rows: ExperienceRow[] }) {
  return (
    <RecordEditor<ExperienceRow, ExperienceFormValues>
      title="Work History"
      description="Mark the role you currently hold so the end date is ignored."
      rows={rows}
      idOf={(experience) => experience.id}
      toFormValues={(experience) => ({
        id: experience.id,
        company: experience.company,
        title: experience.title,
        location: experience.location ?? "",
        employment_type: experience.employment_type ?? "",
        start_date: experience.start_date ?? "",
        end_date: experience.end_date ?? "",
        is_current: experience.is_current,
        summary: experience.summary ?? "",
        display_order: experience.display_order,
      })}
      emptyValues={{ ...emptyExperienceValues }}
      formKey="experience"
      action={saveExperienceAction}
      deleteAction={deleteExperienceAction}
      emptyMessage="No roles yet. Add your first one below."
      columns={columns}
    />
  );
}
