# UX Flows

## Flow 1 — Browse Campus Activity

1. User opens WaddlePolitan
2. User sees landing page or authenticated app shell
3. User opens Explore / Map
4. Map is centered on TMU campus
5. Recent posts appear as markers
6. User taps a marker
7. A preview appears
8. User can open full post detail
9. User can return to map without losing context where practical

## Flow 2 — Browse Feed

1. User opens Feed
2. Recent posts appear newest-first
3. Each card shows enough context to understand:
   - what happened
   - where
   - when
   - optional image
4. User opens post detail
5. User can view the post on the map

## Flow 3 — Create a Post

1. Authenticated user taps Create
2. User enters post text
3. User selects a campus location
4. User optionally uploads an image
5. Client validates required fields
6. Image uploads to Supabase Storage if present
7. Post row is created
8. User sees success state
9. User returns to feed/map and the post is visible

Location selection should be easy. Good MVP approaches include:
- choose a predefined campus building/location
- click/tap a point on the campus map
- combine a location label with coordinates

Avoid requiring a full Google-style address search for MVP.

## Flow 4 — Delete Own Post

1. Authenticated author opens their post
2. Delete control is visible only for eligible user
3. User confirms delete
4. Delete request is sent
5. RLS enforces ownership
6. Associated image is cleaned up if the implementation supports it
7. UI updates

## Flow 5 — Profile

1. User opens profile
2. Sees display identity
3. Sees their posts
4. Can open a post
5. Can delete owned posts

## Empty States

Examples:
- no posts yet near this map area
- feed has no posts
- user has not posted yet
- image failed to load

Empty states should encourage the next action without feeling broken.

## Error States

Always provide useful user-facing feedback for:
- auth failure
- upload failure
- post creation failure
- map loading failure
- network failure
