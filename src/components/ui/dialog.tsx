"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "./button";
export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);
  return <dialog ref={ref} onCancel={onClose} onClose={onClose} aria-label={title} className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-6 text-foreground shadow-float"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">{title}</h2><Button variant="ghost" onClick={onClose} aria-label="Close dialog" className="px-3">✕</Button></div>{children}</dialog>;
}
