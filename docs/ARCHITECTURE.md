# Architecture

## Guiding Principle

Use the minimum architecture required to ship a reliable campus web app.

## Suggested High-Level Architecture

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

Preferred:
- TypeScript
- React
- Next.js if the existing repository uses it or the project is still early
- Tailwind CSS if present

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

The exact provider may be:
- Mapbox
- MapLibre
- Leaflet with a suitable tile provider
- another provider already used by the repository

Do not change providers without a reason.

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
