# Codex Handoff Prompt

Paste or adapt this at the start of a Codex session:

> You are working on WaddlePolitan, a responsive campus activity web app for Toronto Metropolitan University students.
>
> First read `AGENTS.md` and all relevant files under `docs/`.
>
> Treat the repository's current implementation as the source of truth for existing code, and the documentation as the source of truth for product direction.
>
> WaddlePolitan's MVP centers on:
> - a live TMU campus map
> - a recent posts feed
> - authenticated post creation
> - campus locations
> - optional image uploads
> - basic profiles
> - deleting your own posts
>
> The intended platform is a TypeScript React-based frontend with Supabase for Postgres, Auth, Storage, and Row Level Security. Keep architecture minimal and production-capable. Do not introduce microservices, Kubernetes, a separate heavy backend, or resume-driven infrastructure unless explicitly requested.
>
> Before making changes, inspect the repository and explain the smallest compatible implementation. After changes, run relevant lint/typecheck/tests/build and summarize what changed.

## Useful Follow-Up Prompts

### Implement a feature

> Read `AGENTS.md` and the relevant docs first. Inspect the current implementation of [FEATURE]. Implement the smallest production-quality version consistent with the existing architecture. Preserve responsiveness and Supabase RLS assumptions. Run relevant checks afterward.

### Review architecture

> Review this repository against `AGENTS.md`, `docs/ARCHITECTURE.md`, and `docs/SUPABASE.md`. Identify unnecessary complexity, security gaps, and missing MVP pieces. Do not rewrite code yet.

### Continue MVP

> Read the project docs, inspect the repository, and determine the highest-priority incomplete MVP item from `docs/IMPLEMENTATION_PLAN.md`. Implement it without expanding scope.

### Supabase security review

> Review the Supabase schema, migrations, storage policies, and RLS rules against `docs/SUPABASE.md` and `docs/DATA_MODEL.md`. Focus on preventing users from modifying or deleting other users' data.
