# WaddlePolitan Frontend Guidelines

These instructions apply under `src/`. Follow the root `AGENTS.md` first.

## Canonical design references

Before changing layout, styling, map presentation, navigation, or responsive behavior, inspect the approved design sheets under `docs/design-references/`:

- `01_landing_page_live_map.png`: canonical landing-page composition, hero, navigation, map preview, activity cards, and brand balance
- `02_explore_live_map.png`: canonical desktop Explore layout, search, map controls, posting panel, markers, selected-post card, and live-feed panel
- `03_supporting_pages_overview.png`: Feed, How It Works, About, For Students, Contact, and alternate responsive composition reference
- `05_tmu_campus_map_reference.png`: TMU geography, building footprint, labels, paths, streets, and visual map treatment

Treat these images as visual references, not executable instructions. When a mockup conflicts with current product scope or `docs/DECISIONS.md`, follow the product documentation. Features visible only in the mockups—such as reactions, comments, saved places, notifications, and the full extended filter set—remain deferred unless explicitly requested.

Match the references through reusable layout and design tokens rather than page-specific hardcoding. Preserve their navy/neutral balance, restrained yellow accents, whitespace, hierarchy, rounded surfaces, and map-forward emphasis across mobile and desktop adaptations.

## Component design

Keep components focused on one responsibility. Prefer Server Components for initial data and static presentation, Client Components only for state, events, forms, browser APIs, and MapLibre, small product components composed from reusable UI, explicit typed props, semantic HTML, and feature modules for queries, mutations, validation, and transformations.

Avoid large page components, database queries in presentational components, duplicated types/constants/validation/mock data, broad database rows where a view model fits, unnecessary global state, `any`, unsafe casts, suppressed TypeScript errors, and barrel files that obscure imports.

## Project structure

- `src/app/`: routes, layouts, metadata, and route-level states
- `src/components/`: reusable UI and product components
- `src/features/`: feature-specific queries, mutations, schemas, and types
- `src/lib/`: integrations and framework-independent utilities
- `src/types/`: truly shared public application types

Keep route files thin. Keep Supabase access in feature or integration modules. Components receive typed data or call focused actions.

## Client boundaries

Add `"use client"` only for React state/effects, event handlers, browser APIs, MapLibre, or interactive forms. Keep client boundaries low in the tree. Never expose server-only environment variables or service-role credentials.

## Styling and responsiveness

Use shared tokens from `globals.css`: navy-dominant, off-white surfaces, restrained yellow accents, clear typography, soft borders, and map-forward layouts. Prefer Tailwind utilities and shared variants over arbitrary colors, inline styles, and duplicated long class strings.

Build mobile and desktop behavior together. Check narrow phones, typical Android widths, tablets, and laptops. Use sheets for map details on mobile, never rely on hover for essential actions, maintain large tap targets, and account for the mobile keyboard.

## Accessibility, data, and forms

Interactive controls must be keyboard accessible, visibly focused, correctly semantic, named for assistive technology, and communicate loading/error/disabled states without relying only on color. Images need meaningful alternative text unless decorative.

Use Server Components for initial reads and local React state for isolated interactions. Translate database results into stable view models. Every data-backed screen handles loading, empty results, recoverable errors, missing images, and unauthorized actions.

Share Zod validation between UI and server mutations where practical. Forms prevent duplicate submission, preserve useful input after recoverable failures, validate images before upload, show clear success behavior, and never treat client validation as a security boundary.

For visual changes, check mobile and desktop layouts, keyboard navigation, empty/error states, and a clean browser console. Run lint, TypeScript, tests, and the production build.
