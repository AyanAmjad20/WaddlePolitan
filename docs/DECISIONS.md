# Product & Engineering Decisions

This document records important decisions so Codex does not repeatedly reopen them.

## D001 — WaddlePolitan is a web app
Status: Accepted

The original native/mobile-app direction was dropped.

Build a responsive website for mobile and desktop.

## D002 — The map is core
Status: Accepted

The live TMU campus map is not a secondary feature. It is one of the main product surfaces.

## D003 — Feed is also first-class
Status: Accepted

Students should not be forced to interact only through the map. A standard recent-activity feed should exist.

## D004 — Heads Up and Spotted should not create unnecessary complexity
Status: Accepted

They can be combined into a general campus activity/post model for the MVP.

## D005 — Lost & Found is deferred
Status: Accepted

Do not make Lost & Found a blocker for MVP.

## D006 — Image uploads are valuable for MVP
Status: Accepted

The MVP must support image uploads. Attaching an image is optional for the student.

## D007 — Use Supabase for backend primitives
Status: Accepted

Use:
- Postgres
- Auth
- Storage
- RLS

Prefer Supabase-native capabilities over building unnecessary backend infrastructure.

## D008 — Keep DevOps minimal
Status: Accepted

The goal is to deliver the product to students, not to add infrastructure for resume keywords.

## D009 — Do not introduce Spring Boot for the MVP without a real need
Status: Accepted

A dedicated heavy Java backend is unnecessary for the current MVP when Supabase and a React/Next.js frontend can satisfy requirements.

## D010 — Frontend framework
Status: Accepted

Use the existing Next.js App Router, React, TypeScript, and Tailwind foundation.

## D011 — Visual style
Status: Accepted

Use a polished, navy-dominant interface with restrained yellow accents and a mostly neutral visual system.

## D012 — Security belongs in the database too
Status: Accepted

Ownership-sensitive actions such as deleting posts must be enforced with RLS, not just frontend checks.

## D013 — Map and hosting
Status: Accepted

Use MapLibre for the map and Vercel for frontend hosting, as established in `AGENTS.md`. Supabase provides the hosted backend. These choices do not imply those integrations are already implemented or configured.
