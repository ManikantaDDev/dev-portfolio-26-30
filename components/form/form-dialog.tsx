"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  keepMounted?: boolean;
};

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  keepMounted = false,
}: FormDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal keepMounted={keepMounted}>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        <Dialog.Viewport className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Popup
            className={cn(
              "w-full max-w-lg rounded-lg bg-white p-6 shadow-xl focus:outline-none",
              className,
            )}
          >
            <header className="mb-4 space-y-1 pr-8">
              <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>

              {description ? (
                <Dialog.Description className="text-sm text-muted-foreground">
                  {description}
                </Dialog.Description>
              ) : null}
            </header>

            {children}

            {footer ? <footer className="mt-6 flex justify-end gap-3">{footer}</footer> : null}

            <Dialog.Close
              aria-label="Close"
              className="absolute right-4 top-4 rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </Dialog.Close>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
