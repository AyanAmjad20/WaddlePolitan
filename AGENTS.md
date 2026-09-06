# WaddlePolitan — Codex Working Context

This repository contains **WaddlePolitan**, a student-focused campus web app for Toronto Metropolitan University (TMU).

Read this file first, then read the documents in `docs/` before making architectural or product changes.

## Core Product Idea

WaddlePolitan is a responsive website that helps TMU students see what is happening around campus through:

- a live campus map
- student-created posts attached to campus locations
- a chronological / recent activity feed
- lightweight post creation with optional images
- basic user profiles

The product should feel fun, campus-specific, useful, and lightweight rather than like a generic social network.

## Current Product Direction

- Web app, **not a native mobile app**
- Must work well on both mobile and laptop/desktop
- The campus map is a core product surface
- "Heads Up" and "Spotted" should be treated as one broad post/activity concept in the MVP
- Lost & Found is a later feature, not required for MVP
- Image uploads are part of the intended MVP experience
- Visual identity is mostly neutral/navy with restrained yellow accents inspired by TMU colours
- The MVP should prioritize shipping and student usability over resume-driven complexity

## Engineering Philosophy

Prefer the simplest production-capable implementation.

Do:
- use the existing project structure when reasonable
- keep the system easy to understand
- use Supabase capabilities instead of rebuilding commodity backend services
- make small, reviewable changes
- keep database rules and auth secure by default
- preserve mobile responsiveness
- document material architectural decisions

Avoid:
- premature microservices
- unnecessary queues or distributed systems
- complex DevOps before there is a real need
- over-engineered abstractions
- adding features outside the MVP unless explicitly requested

## Stack

Current intended backend/platform:
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Row Level Security

Frontend direction:
- TypeScript
- React-based web frontend
- Next.js is a reasonable preferred choice if the repository already uses it or is still early
- If the existing repository already uses another React setup, do not rewrite it solely for preference

Styling:
- Tailwind CSS is preferred if already present

## Canonical Documentation

Read:
- `docs/PRODUCT.md`
- `docs/MVP_SCOPE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/UX_FLOWS.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/SUPABASE.md`
- `docs/API_CONTRACTS.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/TESTING.md`
- `docs/DEPLOYMENT.md`
- `docs/DECISIONS.md`
- `docs/NON_GOALS.md`
- `docs/ROADMAP.md`

If documents conflict, prefer:
1. explicit user instructions in the current Codex session
2. `AGENTS.md`
3. `docs/DECISIONS.md`
4. the rest of `docs/`

## How Codex Should Work

Before implementing a substantial feature:
1. inspect the current repository
2. identify the smallest compatible change
3. check whether a relevant product decision already exists in `docs/`
4. implement
5. run available lint/tests/build checks
6. summarize changed files and any unresolved issue

Do not silently change product direction.
