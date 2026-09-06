# Data / API Contracts

With Supabase, much of the app may use database queries directly through the Supabase client rather than a large custom REST layer.

These contracts describe the logical operations the frontend needs.

## Get Recent Posts

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

## Get Post By ID

Input:
- post id

Output:
- complete post
- author summary
- location information

## Create Post

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

## Delete Post

Authenticated.

Input:
- post id

Authorization:
- database policy must enforce `author_id = auth.uid()`

## Get Profile

Input:
- user id

Output:
- id
- display name
- avatar
- recent posts

## Update Own Profile

Authenticated.

Allowed:
- fields explicitly supported by UI

Not allowed:
- changing user id
- modifying another profile

## Error Handling

UI should translate raw backend failures into understandable messages.

Do not expose:
- service-role secrets
- stack traces
- internal SQL details
