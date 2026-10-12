import { AdminShell } from "@/components/admin/admin-shell";
import RecordEditor from "@/features/admin/record-editor";
import { deleteEducationAction, saveEducationAction } from "@/actions/education";
import { emptyEducationValues, type EducationFormValues } from "@/forms/config/validations";
import { getEducations, requireUser } from "@/lib/portfolio/queries";
import type { EducationRow } from "@/types/database";

function formatRange(row: EducationRow): string {
  const start = row.start_date ? row.start_date.slice(0, 7) : null;
  const end = row.end_date ? row.end_date.slice(0, 7) : null;

  if (!start && !end) return "\u2014";

  return `${start ?? "\u2014"} \u2014 ${end ?? "\u2014"}`;
}

export default async function EducationPage() {
  const user = await requireUser("/admin/education");
  const educations = await getEducations(user.id);

  return (
    <AdminShell
      title="Education"
      description="Qualifications you want listed on your portfolio."
    >
      <RecordEditor<EducationRow, EducationFormValues>
        title="Education"
        description="Add a qualification using the form below."
        rows={educations}
        idOf={(education) => education.id}
        toFormValues={(education) => ({
          id: education.id,
          institution: education.institution,
          degree: education.degree ?? "",
          field_of_study: education.field_of_study ?? "",
          start_date: education.start_date ?? "",
          end_date: education.end_date ?? "",
          grade: education.grade ?? "",
          summary: education.summary ?? "",
          display_order: education.display_order,
        })}
        emptyValues={{ ...emptyEducationValues }}
        formKey="education"
        action={saveEducationAction}
        deleteAction={deleteEducationAction}
        emptyMessage="No qualifications yet. Add your first one below."
        columns={[
          {
            header: "Institution",
            render: (education) => (
              <div className="min-w-0">
                <p className="truncate font-medium">{education.institution}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {[education.degree, education.field_of_study].filter(Boolean).join(", ") ||
                    "No degree listed"}
                </p>
              </div>
            ),
          },
          {
            header: "Period",
            render: (education) => (
              <span className="text-muted-foreground">{formatRange(education)}</span>
            ),
          },
          {
            header: "Grade",
            render: (education) => (
              <span className="text-muted-foreground">{education.grade ?? "\u2014"}</span>
            ),
          },
        ]}
      />
    </AdminShell>
  );
}
