"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import GenericForm, { type SubmitResult } from "@/forms/generic-form";
import { formStores, type FormKey } from "@/forms/stores";
import type { FormStoreHook } from "@/forms/generic-form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export type DeleteResult = { error?: string; message?: string };

export type RecordEditorProps<
  T,
  F extends Record<string, unknown>,
> = {
  title: string;
  description: string;
  rows: T[];
  idOf: (row: T) => string;
  toFormValues: (row: T) => F;
  emptyValues: F;
  columns: Column<T>[];
  formKey: FormKey;
  action: (values: F) => Promise<SubmitResult>;
  deleteAction: (id: string) => Promise<DeleteResult>;
  emptyMessage: string;
  /** Rendered next to the form, e.g. a publish toggle. */
  rowActions?: (row: T, isPending: boolean) => ReactNode;
  /** True while a row is in edit mode, to highlight the table. */
  isEditing?: (row: T) => boolean;
};

/**
 * Table + create/edit form + delete, shared by every admin CRUD screen so the
 * behaviour (reset the zustand store on edit, refresh after a write) lives in
 * one place.
 */
export default function RecordEditor<T, F extends Record<string, unknown>>({
  title,
  description,
  rows,
  idOf,
  toFormValues,
  emptyValues,
  columns,
  formKey,
  action,
  deleteAction,
  emptyMessage,
  rowActions,
  isEditing,
}: RecordEditorProps<T, F>) {
  const router = useRouter();
  const useStore = formStores[formKey] as unknown as FormStoreHook<F>;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const editingRow = editingId ? rows.find((row) => idOf(row) === editingId) ?? null : null;

  /**
   * GenericForm seeds the store from `initialValues` on mount, so the store has
   * to be cleared first for the new row's values to take effect.
   */
  function remountForm(nextEditingId: string | null) {
    useStore.getState().resetForm();
    setEditingId(nextEditingId);
    setFormVersion((version) => version + 1);
  }

  function resetToCreate() {
    remountForm(null);
  }

  function startEdit(row: T) {
    remountForm(idOf(row));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(values: F): Promise<SubmitResult> {
    const response = await action(values);

    if (!response?.error) {
      resetToCreate();
      router.refresh();
    }

    return response;
  }

  function handleDelete(row: T) {
    startTransition(async () => {
      setErrorMessage(null);
      const response = await deleteAction(idOf(row));

      if (response?.error) {
        setErrorMessage(response.error);
        return;
      }

      if (editingId === idOf(row)) resetToCreate();
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">
              {rows.length === 0 ? description : `${rows.length} saved. ${description}`}
            </p>
          </div>
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

        {rows.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.header} className={column.className}>
                      {column.header}
                    </TableHead>
                  ))}
                  <TableHead className="w-[10rem] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const id = idOf(row);
                  const editing = isEditing?.(row) ?? id === editingId;

                  return (
                    <TableRow key={id} data-editing={editing ? "" : undefined}>
                      {columns.map((column) => (
                        <TableCell key={column.header} className={column.className}>
                          {column.render(row)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {rowActions?.(row, isPending)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(row)}
                            disabled={isPending}
                          >
                            <Pencil />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(row)}
                            disabled={isPending}
                          >
                            <Trash2 />
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
            <Plus className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        {editingRow ? (
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">Editing an entry</h3>
            <Button variant="ghost" size="sm" onClick={resetToCreate} disabled={isPending}>
              Cancel edit
            </Button>
          </div>
        ) : null}

        <GenericForm<F>
          key={`${editingId ?? "create"}-${formVersion}`}
          formKey={formKey}
          configOptions={{ mode: editingRow ? "edit" : "create" }}
          action={handleSave}
          initialValues={editingRow ? toFormValues(editingRow) : emptyValues}
          className="max-w-2xl"
        />

        {isPending ? (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Saving your changes...
          </p>
        ) : null}
      </section>
    </div>
  );
}
