# Testing Strategy

Testing should be proportional to the MVP.

## Required Quality Gates

At minimum before merge/deploy:
- TypeScript passes
- lint passes
- production build passes
- critical flows manually smoke-tested

## High-Value Unit/Component Tests

Prioritize:
- post validation
- map/post data transformation
- auth-dependent UI
- ownership UI
- upload validation
- date/time formatting utilities

## Integration Tests

Useful targets:
- create post
- fetch feed
- fetch post detail
- delete own post
- prevent deleting another user's post
- profile update permissions

## End-to-End Critical Path

If E2E infrastructure exists, cover:

1. sign in
2. create post
3. post appears in feed
4. post appears on map
5. open detail
6. delete post

## RLS Tests

Security policies deserve explicit verification.

Verify:
- unauthenticated insert blocked if auth is required
- authenticated user can insert own post
- user cannot spoof another author id
- user can delete own post
- user cannot delete someone else's post
- storage ownership behaves as intended

## Manual Mobile Testing

Check at least:
- narrow iPhone-like viewport
- Android-like viewport
- standard laptop viewport

Pay special attention to:
- map height
- bottom navigation
- sheets/modals
- image upload
- keyboard covering form controls
