import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
type Variant = "primary" | "secondary" | "accent" | "ghost" | "danger";
const variants: Record<Variant, string> = {
  primary: "bg-navy text-white shadow-card hover:bg-navy-dark",
  secondary: "border border-border bg-surface text-navy hover:bg-surface-muted",
  accent: "bg-yellow text-navy-dark hover:bg-yellow/80",
  ghost: "text-navy hover:bg-surface-muted",
  danger: "bg-danger text-white hover:bg-danger/90",
};
export function buttonClass(variant: Variant = "primary", className = "") {
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${variants[variant]} ${className}`;
}
export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}
export function ButtonLink({ variant = "primary", className = "", ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
