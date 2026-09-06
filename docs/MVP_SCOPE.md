# MVP Scope

## Required for MVP

### 1. Responsive Web App
- mobile-first
- usable on laptop/desktop
- no native iOS/Android app required

### 2. Authentication
Keep this simple.

Minimum:
- sign up
- sign in
- sign out
- persistent session

Supabase Auth should be preferred.

### 3. Live Campus Map
- centered on TMU campus
- markers for recent posts
- clickable/tappable marker previews
- route to post detail if needed
- responsive behavior on mobile and desktop

### 4. Feed
- recent posts
- basic pagination or load-more
- time
- user identity/display name if available
- optional image
- location label
- link/open behavior into detail/map context

### 5. Post Creation
Minimum fields:
- text/body
- campus location
- optional image

Optional:
- simple category such as `spotted`, `heads_up`, or a unified category model

The product direction is to avoid unnecessary separation between "Heads Up" and "Spotted" in the MVP.

### 6. Post Detail
- post content
- image if present
- author summary
- timestamp
- location
- map context or "view on map"

### 7. User Profile
Minimum:
- display name
- avatar if implemented
- user's own posts

### 8. Delete Own Post
Authenticated users should be able to delete their own posts.

Use Row Level Security so ownership is enforced in the database, not only in frontend code.

## Nice-to-Have After Core MVP

- edit post
- reactions
- comments
- report post
- saved posts
- richer category filters
- cluster markers
- better profile customization
- lightweight moderation dashboard

## Deferred

Do not block MVP on:
- Lost & Found
- direct messaging
- followers/following
- native mobile apps
- push notifications
- complex moderation tooling
- microservices
- recommendation algorithms
- AI features
- gamification
- advanced analytics
