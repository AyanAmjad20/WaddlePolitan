# Design System

## Visual Direction

The visual language should be:
- clean
- modern
- campus-oriented
- map-forward
- navy-dominant
- mostly neutral
- accented sparingly with yellow

Earlier design direction favored roughly **90% neutral/navy** with yellow used as an accent rather than as a dominant background.

## Colour Philosophy

Use semantic design tokens rather than hardcoding arbitrary colours everywhere.

Suggested roles:

- `background`: off-white / very light neutral
- `surface`: white
- `surface-muted`: light gray
- `navy`: primary brand / navigation / headings
- `navy-dark`: strong contrast
- `yellow`: accent / CTA / selected marker / highlight
- `text`: near-black / dark navy
- `text-muted`: gray
- `border`: soft gray
- `danger`: destructive actions only
- `success`: success states only

Exact colour values should follow the current implementation if a palette already exists.

## Typography

Prefer:
- clear sans-serif
- strong hierarchy
- readable body text
- modest use of bold
- compact UI labels

Avoid:
- overly decorative fonts
- tiny text
- excessive uppercase

## Layout

### Desktop
A useful pattern is:
- persistent top navigation
- map/feed split where appropriate
- constrained content width for reading
- generous whitespace

### Mobile
Prefer:
- map or feed as the main full-width surface
- bottom or compact navigation if already designed
- large tap targets
- sheets/drawers for map marker details
- obvious Create action

## Components

Core reusable components should include:
- Button
- IconButton
- Input
- TextArea
- Card
- PostCard
- Avatar
- Badge/CategoryPill
- MapMarker
- PostPreview
- Modal/Sheet
- EmptyState
- LoadingState
- ErrorState

## Interaction Rules

- Selected map markers should have a visible state
- Hover must never be the only way to reveal information
- Images should preserve aspect ratio
- Forms must show submitting/loading/error states
- Destructive actions should be clearly styled and preferably require confirmation
- Mobile controls must be thumb-friendly

## Product Branding

The name **WaddlePolitan** can be playful, but the interface itself should remain polished.

Avoid filling the UI with penguin jokes or novelty elements unless specifically requested.
