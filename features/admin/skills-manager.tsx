"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Pencil, Sparkles, Star, Trash2 } from "lucide-react";
import GenericForm, { type SubmitResult } from "@/forms/generic-form";
import {
  emptySkillValues,
  type Skill,
  type SkillFormValues,
} from "@/forms/config/validations";
import { deleteSkillAction, saveSkillAction } from "@/actions/skills";
import { useSkillFormStore } from "@/stores/form/skill/store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SkillsManager({ skills }: { skills: Skill[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const editingSkill = editingId ? skills.find((skill) => skill.id === editingId) ?? null : null;

  function resetToCreate() {
    setEditingId(null);
    useSkillFormStore.getState().resetForm();
    setFormVersion((version) => version + 1);
  }

  function startEdit(skill: Skill) {
    setEditingId(skill.id);
    useSkillFormStore.getState().resetForm();
    setFormVersion((version) => version + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(values: SkillFormValues): Promise<SubmitResult> {
    const response = await saveSkillAction(values);

    if (!response?.error) {
      resetToCreate();
      router.refresh();
    }

    return response;
  }

  function handleDelete(skill: Skill) {
    startTransition(async () => {
      setErrorMessage(null);

      const response = await deleteSkillAction(skill.id);

      if (response?.error) {
        setErrorMessage(response.error);
        return;
      }

      if (editingId === skill.id) {
        resetToCreate();
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Your Skills</h2>
          <p className="text-sm text-muted-foreground">
            {skills.length === 0
              ? "No skills yet. Add your first one below."
              : `${skills.length} skill${skills.length === 1 ? "" : "s"} on your profile.`}
          </p>
        </div>

        {errorMessage ? (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        ) : null}

        {skills.length > 0 ? (
          <div className="rounded-xl border border-border bg-card shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Proficiency</TableHead>
                  <TableHead className="text-right">Years</TableHead>
                  <TableHead className="w-[9rem] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((skill) => (
                  <TableRow key={skill.id} data-editing={skill.id === editingId}>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-1.5">
                        {skill.name}
                        {skill.is_featured ? (
                          <Star className="size-3.5 fill-current text-primary" aria-label="Featured" />
                        ) : null}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{skill.category}</TableCell>
                    <TableCell className="text-muted-foreground">{skill.level}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {skill.years ?? "\u2014"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(skill)}
                          disabled={isPending}
                        >
                          <Pencil />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(skill)}
                          disabled={isPending}
                        >
                          <Trash2 />
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
            <Sparkles className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your skills will appear here once you add them.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        {editingSkill ? (
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Editing &ldquo;{editingSkill.name}&rdquo;
            </h3>
            <Button variant="ghost" size="sm" onClick={resetToCreate} disabled={isPending}>
              Cancel edit
            </Button>
          </div>
        ) : null}

        <GenericForm<SkillFormValues>
          key={`${editingId ?? "create"}-${formVersion}`}
          formKey="skill"
          configOptions={{ mode: editingSkill ? "edit" : "create" }}
          action={handleSave}
          initialValues={editingSkill ? { ...editingSkill } : { ...emptySkillValues }}
        />

        {isPending ? (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Updating your skills...
          </p>
        ) : null}
      </section>
    </div>
  );
}