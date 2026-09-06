# Data Model

This is a practical MVP model. Adjust naming to match the existing schema.

## `profiles`

One profile per authenticated user.

Suggested columns:

```sql
id uuid primary key references auth.users(id) on delete cascade,
display_name text,
avatar_url text,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

Possible later fields:
- bio
- program
- graduation_year

Avoid collecting more personal data than the product needs.

## `campus_locations`

A controlled list of common TMU places/buildings.

Suggested columns:

```sql
id uuid primary key default gen_random_uuid(),
name text not null,
short_name text,
latitude double precision not null,
longitude double precision not null,
is_active boolean not null default true,
created_at timestamptz not null default now()
```

Why use this table:
- consistent map labels
- simpler post creation
- easier filtering
- avoids arbitrary location strings

Posts may still store coordinates if finer-grained markers are desired.

## `posts`

Suggested columns:

```sql
id uuid primary key default gen_random_uuid(),
author_id uuid not null references profiles(id) on delete cascade,
body text not null,
category text,
location_id uuid references campus_locations(id),
latitude double precision,
longitude double precision,
image_path text,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

Rules:
- `body` should have a reasonable maximum length
- location should be required in the UX
- either `location_id` or usable coordinates should be present
- `image_path` should preferably store the storage path rather than a fragile public URL

## Category

Do not over-model categories.

Possible MVP values:
- `spotted`
- `heads_up`
- `general`

However, product direction favors treating Heads Up / Spotted as a unified activity concept. A category can remain optional until there is a real UX reason to expose it.

## Future Tables — Not Required for MVP

Potential later tables:
- `comments`
- `reactions`
- `post_reports`
- `saved_posts`
- `notifications`

Do not create them preemptively.
