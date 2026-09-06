# Supabase Guidance

## Services to Use

Use Supabase for:
- Auth
- Postgres
- Storage
- RLS
- optional Realtime

## Environment Variables

Never commit secrets.

Typical variables may include:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Rules:
- the anon/publishable client key may be used by the browser as intended
- the service role key must never be shipped to the client
- server-only variables must remain server-only
- `.env*` files containing secrets should be ignored by Git

## Authentication

MVP options:
- email/password
- magic link
- OAuth if already configured

Do not block the project on school SSO.

## Row Level Security

Enable RLS for user-owned content.

Expected intent:

### Profiles
- public read if profiles are visible
- authenticated user can update only their own profile

### Posts
- public/authenticated read depending on product decision
- authenticated user can insert a post with `author_id = auth.uid()`
- author can update/delete only their own post

## Storage

Suggested bucket:
- `post-images`

Suggested path pattern:

```text
<user_id>/<post_id-or-random-id>/<filename>
```

Storage policies should prevent users from deleting or overwriting unrelated users' files.

## Database Migrations

Prefer migrations over ad hoc dashboard-only changes.

Keep schema changes versioned in the repository where possible.

## Seed Data

Maintain a small seed list for TMU campus locations.

Examples may include major buildings/landmarks, but do not invent exact coordinates when they are not already verified.

## Realtime

Use only if it materially improves the experience.

If enabled, subscribe narrowly to relevant post changes and clean up subscriptions correctly.
