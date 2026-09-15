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

## Data Operations

With Supabase, much of the app may use database queries directly through the Supabase client rather than a large custom REST layer.

These contracts describe the logical operations the frontend needs.

### Get Recent Posts

Input:
- optional limit
- optional cursor/page
- optional map bounds
- optional location

Output fields:
- post id
- body
- category if used
- created_at
- author summary
- image reference/url
- location label
- latitude/longitude

Default sort:
- newest first

### Get Post By ID

Input:
- post id

Output:
- complete post
- author summary
- location information

### Create Post

Authenticated.

Input:
```ts
{
  body: string;
  locationId?: string;
  latitude?: number;
  longitude?: number;
  imagePath?: string;
  category?: string;
}
```

Validation:
- non-empty body
- acceptable max length
- valid location
- supported image type/size if image exists

### Delete Post

Authenticated.

Input:
- post id

Authorization:
- database policy must enforce `author_id = auth.uid()`

### Get Profile

Input:
- user id

Output:
- id
- display name
- avatar
- recent posts

### Update Own Profile

Authenticated.

Allowed:
- fields explicitly supported by UI

Not allowed:
- changing user id
- modifying another profile

### Error Handling

UI should translate raw backend failures into understandable messages.

Do not expose:
- service-role secrets
- stack traces
- internal SQL details

## Decisions Required Before Implementation

These are proposed operations, not implemented API guarantees. Record decisions in `DECISIONS.md` before implementing the affected feature:

- Whether public browsing includes both posts and profiles.
- Whether posts require a predefined location or may use coordinates alone.
- Exact body length, supported image types, and upload size limits.
- Pagination cursor format and error/result types.

Keep validation, database constraints, and UI behavior consistent with those decisions.
