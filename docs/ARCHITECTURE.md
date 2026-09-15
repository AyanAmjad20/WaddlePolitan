# Architecture

## Guiding Principle

Use the minimum architecture required to ship a reliable campus web app.

## High-Level Architecture

```text
Browser
  |
  v
React / Next.js frontend
  |
  +--> Supabase Auth
  |
  +--> Supabase PostgreSQL
  |
  +--> Supabase Storage
```

Where server-side application logic is necessary, use the framework's normal server/runtime capabilities or Supabase server functions before introducing a separate Node service.

## Frontend

Established stack:
- TypeScript
- React
- Next.js App Router
- Tailwind CSS

Responsibilities:
- page rendering
- client interaction
- map
- auth UI
- feed
- forms
- upload flow
- optimistic or post-submit updates
- display of Supabase data

## Backend / Data Platform

Supabase should provide:
- PostgreSQL
- Auth
- Storage
- Row Level Security
- generated client APIs / database access
- optional realtime only if it materially improves the map/feed

## Realtime

A "live map" does not require complex streaming infrastructure.

For MVP, either is acceptable:
1. normal refresh/revalidation/polling
2. Supabase Realtime subscription for inserted/deleted posts

Prefer the simpler option unless realtime behavior is already straightforward.

## Map Provider

Keep map implementation isolated behind reusable components.

Use MapLibre for the campus map, consistent with `AGENTS.md`. Select a suitable tile/style provider during map implementation.

## Security Boundary

Authorization must not rely solely on hidden frontend buttons.

Use Supabase RLS for:
- inserting posts as authenticated users
- deleting only owned posts
- updating only owned profile data
- appropriate storage permissions

## Complexity Budget

Do not introduce for MVP:
- microservices
- Kafka
- Kubernetes
- Redis
- message queues
- service meshes
- event sourcing
- CQRS
- custom auth

Also outside the MVP: distributed caching, elaborate backend-for-frontend layers, GraphQL migrations for their own sake, complex domain-driven architecture, premature performance optimization, custom file storage, and self-hosted Supabase.

If an implementation adds substantial complexity without improving the core student experience, reconsider a simpler design.
