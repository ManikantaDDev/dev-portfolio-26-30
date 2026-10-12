"use client";

import type { Column } from "@/features/admin/record-editor";
import RecordEditor from "@/features/admin/record-editor";
import { deleteSkillAction, saveSkillAction } from "@/actions/skills";
import {
  emptySkillValues,
  type SkillFormValues,
} from "@/forms/config/validations";
import type { SkillRow } from "@/types/database";

const columns: Column<SkillRow>[] = [
  {
    header: "Skill",
    render: (skill) => <span className="font-medium">{skill.name}</span>,
  },
  { header: "Category", render: (skill) => skill.category },
  {
    header: "Proficiency",
    render: (skill) => <span className="text-muted-foreground">{skill.level}</span>,
  },
  {
    header: "Years",
    className: "text-right",
    render: (skill) => <span className="text-muted-foreground">{skill.years ?? "\u2014"}</span>,
  },
  {
    header: "Featured",
    className: "text-right",
    render: (skill) => (
      <span className="text-muted-foreground">{skill.is_featured ? "Yes" : "No"}</span>
    ),
  },
];

export function SkillsManager({ rows }: { rows: SkillRow[] }) {
  return (
    <RecordEditor<SkillRow, SkillFormValues>
      title="Your Skills"
      description="Mark a skill as featured to highlight it on your homepage."
      rows={rows}
      idOf={(skill) => skill.id}
      toFormValues={(skill) => ({
        id: skill.id,
        name: skill.name,
        category: skill.category as SkillFormValues["category"],
        level: skill.level as SkillFormValues["level"],
        years: skill.years,
        is_featured: skill.is_featured,
        display_order: skill.display_order,
      })}
      emptyValues={{ ...emptySkillValues }}
      formKey="skill"
      action={saveSkillAction}
      deleteAction={deleteSkillAction}
      emptyMessage="No skills yet. Add your first one below."
      columns={columns}
    />
  );
}
