# Implementation Plan

This plan is ordered to get to a shareable MVP quickly.

## Current Baseline

At documentation consolidation, the Desktop WaddlePolitan repository contains the Next.js starter, project documentation, and design references. Product pages, the map, Supabase integration/migrations, and tests still need implementation here. The deleted Downloads copy was not consolidated into this repository.

The phases below are planned work, not a record of completed features. Track completion as each working feature is verified.

## Phase 0 — Inspect Existing Repository

Before new implementation:
- identify framework
- identify routing setup
- identify styling approach
- inspect existing Supabase client/config
- inspect existing schema/migrations
- inspect current map code
- run current lint/test/build

Do not rewrite working foundations without a concrete benefit.

## Phase 1 — App Shell

Build/stabilize:
- navigation
- responsive layout
- route structure
- loading/error conventions

Suggested routes:

```text
/
 /map
 /feed
 /create
 /post/[id]
 /profile/[id]
 /login
```

Adjust to framework conventions.

## Phase 2 — Supabase Foundation

- environment variables
- client setup
- auth
- profiles
- posts table
- campus locations
- RLS
- storage bucket/policies

## Phase 3 — Feed

- fetch recent posts
- PostCard
- empty/loading/error states
- pagination/load more
- post detail link

## Phase 4 — Map

- campus-centered map
- fetch geolocated posts
- markers
- marker selection
- post preview
- responsive mobile behavior

## Phase 5 — Create Post

- create form
- location picker
- optional image upload
- validation
- insert post
- success redirect/update

## Phase 6 — Profile + Ownership

- current user profile
- user posts
- delete own post
- database-backed authorization

## Phase 7 — Polish

- accessibility pass
- mobile spacing/tap targets
- loading states
- image optimization
- basic SEO for landing page
- metadata/favicon
- analytics only if useful

## Definition of MVP Done

The MVP is done when a student can:
1. open the site on a phone
2. sign in
3. browse feed
4. browse posts on TMU map
5. create a location-linked post
6. upload an optional image
7. view the post
8. delete their own post

and the app can be deployed reliably.
