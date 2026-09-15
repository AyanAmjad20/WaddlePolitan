import type { ReactNode } from "react";
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center"><div className="mb-3 text-3xl" aria-hidden="true">🪶</div><h2 className="text-lg font-semibold">{title}</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}
export function ErrorState({ message }: { message: string }) { return <p role="alert" className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">{message}</p>; }
export function LoadingState() { return <div role="status" className="space-y-4 p-5"><span className="sr-only">Loading sightings…</span>{[1,2,3].map(i => <div key={i} className="h-32 animate-pulse rounded-2xl bg-surface-muted" />)}</div>; }
