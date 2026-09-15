import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
export const fieldClass = "w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground placeholder:text-muted/70 focus:border-navy focus:outline-2 focus:outline-navy/15 disabled:bg-surface-muted";
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={`${fieldClass} ${props.className ?? ""}`} />; }
export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className={`${fieldClass} resize-y ${props.className ?? ""}`} />; }
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} className={`${fieldClass} ${props.className ?? ""}`} />; }
export function FormField({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: ReactNode }) {
  return <div className="space-y-2"><label htmlFor={htmlFor} className="block text-sm font-semibold">{label}</label>{children}{hint && <p className="text-xs leading-relaxed text-muted">{hint}</p>}</div>;
}
