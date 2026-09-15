"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <div role="alert" className="mx-auto max-w-xl space-y-4 px-5 py-20"><h1 className="text-3xl font-bold">A small bump in the path</h1><p className="text-muted">This page could not load. Try again; your saved demo sightings stay in this browser.</p><Button onClick={reset}>Try again</Button></div>; }
