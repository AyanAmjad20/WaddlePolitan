# Component and Agent Build Strategy

Status: Proposed execution plan, September 14, 2026. No implementation or agent dispatch is implied.

## Current priority: frontend prototype (supersedes the production waves below)

The user's immediate scope is the complete frontend using mock data and localStorage. Supabase, real authentication, database policies, remote uploads, backend count aggregation, and multi-user realtime are later integration work. Keep the established Next.js/Tailwind/MapLibre direction and approved design references. The production plan below is retained for that later stage; its backend gates do not block this prototype.

### Sequential foundation, parallel screens, sequential integration

1. **Sequential foundation:** one owner creates design tokens, responsive shell, core UI primitives, sighting types, one representative SightingCard, and a single local data adapter. Freeze component props and exports before dispatch. Define routes, initial fixture data, demo identity, and a reset-demo operation. Add missing quality scripts. This provides concrete examples for smaller coding models.
2. **Parallel implementation:** run three agents with exclusive ownership. Map agent owns `src/components/map/**` and map interaction helpers. Product UI agent owns `src/components/sightings/**`, `src/components/reporting/**`, `src/components/auth/**`, and `src/components/profiles/**`. Marketing agent owns `src/components/marketing/**` for landing and supporting pages. Hand ownership of the initial SightingCard to the product UI agent at dispatch. Each delivers exported screen components; integration owner alone edits routes, shared UI, global styling, data adapter, shared contracts, and package files.
3. **Sequential integration:** integration owner composes routes and connects every screen to the same store. Verify create -> map/feed/profile/detail -> delete -> reload. Check selected marker and form draft behavior across desktop/mobile layouts.
4. **Parallel bounded fixes:** assign independent visual/interaction defects back to the owning agents, using screenshots and specific expected behavior. Run no broad redesign work in this phase.
5. **Sequential acceptance:** final mobile/desktop visual review, keyboard checks, console review, persistence checks, lint/typecheck/test/build. Report prototype limitations accurately.

### Commit and GitHub checkpoints

Commit each completed, verified deliverable, including within a sequence. Do not accumulate an entire wave into one commit. Commit locally first, then push each accepted commit to a dedicated `codex/` feature branch on GitHub. Keep the small commits in the pull request; do not squash the complete frontend into one commit. Main-branch merge is a separate release step.

This is a future execution schedule, not an instruction to commit or push the current planning workspace. Existing changes in DATA_MODEL.md, DECISIONS.md, API.md, and MAP_SPEC.md must be reviewed and attributed before implementation; do not sweep them into a frontend commit.

| Sequence | Commit-sized checkpoints, in dependency order | GitHub checkpoint |
|---|---|---|
| Planning baseline | `docs: define frontend build and commit strategy`; include only reviewed planning files | Push the planning commit before coding starts |
| 1. Foundation | `chore: add frontend quality checks`; `feat: add design tokens and shared controls`; `feat: add responsive app shell`; `feat: add local demo store`; `feat: add shared sighting card` | Push after each verified commit; dispatch screen agents only after shared contracts and foundation are available |
| 2A. Map agent | Campus map and controls; marker selection and previews; pin placement; clusters and overlapping-report list | Review, commit and push each usable increment as it arrives |
| 2B. Product UI agent | Feed and detail components; reporting form; profile and demo account UI; photo persistence flow | Review, commit and push each usable increment as it arrives |
| 2C. Marketing agent | Landing page content; How It Works/About; For Students/Contact presentation | Review, commit and push each page or tightly related page pair |
| 3. Integration | Connect feed/detail/profile routes; connect create flow and map selection; connect local confirmations/freshness/estimates | Push each working flow; route wiring may accompany the relevant feature handoff when it makes that commit complete |
| 4. Fixes | One identified responsive, accessibility, persistence, or interaction issue per commit, with its relevant regression coverage | Push each verified fix; no miscellaneous polish dump |
| 5. Acceptance | Only remaining specific fixes and a separate setup/demo documentation commit | Push final accepted state; report branch, commit hashes, checks, and remaining prototype limits |

Checkpoint names are scopes, not a mandate to manufacture commits for empty work. If a checkpoint contains independently reviewable features, split it further. Keep a feature's required tests, types, assets, dependency/lockfile changes, and route wiring together where needed for a buildable commit. Never split at arbitrary line counts or commit broken imports merely to keep commits small.

#### Parallel-agent handoff rules

- Each assignment covers one checkpoint at a time. Once complete, the agent reports its diff and validation and pauses before starting the next checkpoint in the same files. The integration owner reviews and accepts it promptly while independent agents continue their work.
- In the shared checkout, only the integration owner stages, commits, and pushes. Agents never run broad staging or commit commands. Stage exact paths and inspect `git diff --cached` before every commit.
- Verify the proposed commit together with its committed dependencies in an isolated verification checkout/worktree when other agents have unfinished changes. A green build of a mixed working tree is not sufficient evidence for a staged subset. If isolation is unavailable, coordinate a brief stable checkpoint with the agents before full verification.
- In isolated agent worktrees, agents may make their own scoped commits after checks. The integration owner integrates them in dependency order, verifies the assembled result, and pushes the accepted integration branch. Do not cherry-pick unfinished work.
- Run lint, typecheck, tests, and build for each code checkpoint before accepting/pushing it. Use meaningful targeted checks and mobile/desktop visual review for the changed behavior as well. Documentation-only commits need diff/link review, not application tests.
- Never force-push or rewrite already shared commits as routine cleanup. Fix discovered issues with a focused follow-up commit. If a push fails, preserve the local commit, report the failure, and retry without silently accumulating an unreported backlog.

### Local data adapter

- One versioned localStorage record for sightings, confirmations, and demo profile, behind focused operations such as list/get/create/delete/confirm/undo/reset. Pages and cards never read storage directly.
- Seed once on first use; preserve subsequent changes, including an intentionally empty feed. Anchor fixture observation times on first seed so the initial map is useful. Reset explicitly reseeds.
- Hydrate only in the browser with a consistent loading state; avoid server access to localStorage and hydration mismatches.
- Use one reactive in-memory snapshot so changes appear immediately across components; persist writes and listen for storage events to reconcile other tabs. This simulates same-browser updates, not multi-user realtime.
- Validate loaded records and handle corrupted/unavailable/full storage with recoverable feedback. Do not silently discard user-created demo records on failure.
- Use a demo identity for ownership interactions; do not store passwords or pretend local auth provides security.
- For prototype photo persistence, resize/compress and strictly limit photos before storing data URLs; surface quota errors. Do not persist temporary object URLs. Larger/durable photo storage belongs to later storage integration.
- Keep operations asynchronous at the boundary so Supabase can later replace the adapter without rewriting display components. Avoid a generic repository framework.
- Exercise Still there, clusters, freshness and estimates locally with documented provisional rules/fixtures. Clearly treat these as prototype behavior; accepted thresholds and backend enforcement remain future work.

### Model allocation proposal

Current session exposes GPT-6 Astra, GPT-5.6 Sol, Terra, Luna, and GPT-5.5 for agents; GPT-4 and GPT-3.5 are not selectable through the current agent tools.

- Astra: planning, shared contracts, integration review, and escalation for difficult cross-feature failures.
- Terra: suggested default for map interactions and stateful product UI.
- Luna: suggested starting point for marketing pages, straightforward components, and narrowly specified styling fixes.
- Sol: optional escalation for a bounded task that remains incorrect after focused feedback; do not escalate every task automatically.

These assignments are a proposed division of work, not measured cost/speed guarantees. Give each coding agent only its relevant docs, design images, contracts, owned paths, and acceptance checklist. Use short bounded tasks, require screenshots for visual work, and review an early sample before it repeats the pattern across screens. No agents are dispatched by this planning update.

## Baseline and scope

The repository currently has the Next.js starter, Tailwind, documentation, and four approved design sheets. Product routes, shared components, MapLibre, Supabase, migrations, and tests are not implemented. `package.json` has lint/build scripts but lacks typecheck/test scripts.

Use the visual composition in `design-references/` and the animal-sighting behavior in D014/D015. Those decisions supersede the older general-post sequence in IMPLEMENTATION_PLAN.md. Preserve the navy/neutral palette and restrained yellow accents. Do not implement mockup-only reactions, comments, saved places, notifications, online-user totals, or generic campus categories. Do not present illustrative metrics as live data.

Build shared UI first, then one complete sighting workflow, then the remaining map behavior and supporting pages. A page is composition, not a separate implementation of auth, cards, forms, and data access.

## 1. Shared component inventory

| Layer / proposed location | Components | Consumers / boundary |
|---|---|---|
| Tokens: `src/app/globals.css` | Semantic colors, typography, spacing, radii, shadows, focus treatment | Every page; one owner translates the approved design into tokens |
| UI: `src/components/ui/` | Button, IconButton, Input, TextArea, Select, FormField, Avatar, Badge, Surface, Dialog, Sheet, Skeleton, EmptyState, ErrorState | Accessible primitives; no Supabase calls or animal business rules |
| Shell: `src/components/layout/` | Brand, SiteHeader, DesktopNav, MobileNav, AccountMenu, PageContainer, SiteFooter | Public and app layouts share brand/navigation pieces; map gets a viewport-filling layout |
| Sightings: `src/components/sightings/` | SightingCard, SightingPreview, SightingList, AnimalBadge, SightingMeta, PhotoGallery, FreshnessLabel, DeleteSightingButton | Feed, map sidebar, selected detail, profile; reuse card parts rather than a giant component with many switches |
| Reporting: `src/components/reporting/` | SightingForm, AnimalTypeField, CountField, PhotoPicker, LocationSummary, NearbySightingPrompt | Standalone create route and Explore composer use one form and submission lifecycle |
| Map: `src/components/map/` | CampusMap, MapControls, MarkerLayer, ClusterReportList, PinPicker, SightingDetailPanel, MapLegend, ConnectionStatus | One MapLibre integration; marker layers need not be individual React components; mobile detail sheet shares preview content with desktop |
| Marketing: `src/components/marketing/` | SectionHeading, FeatureCard, StepsList, FAQ, CallToAction | Landing, How It Works, About, For Students; extract only repeated structures |

Build primitives when their first feature needs them. Avoid building an exhaustive component library before the app. Include loading, empty, error, disabled, selected, missing-photo, and unauthorized states alongside each component's normal state.

### Responsive composition

- Desktop Explore: header, reporting/filter panel, central map, recent-sightings panel, following reference 02.
- Mobile Explore: map fills available space; compact navigation, clear report action, sheet for selection/reporting, accessible equivalent list. Preserve map position when opening and closing panels. Never mount duplicate desktop/mobile forms.
- Feed/profile: constrained reading width, shared sighting cards, explicit load-more control.
- Marketing: shared header/footer and section spacing, with page-specific content following references 01/03.
- Reuse map configuration and presentation in the landing preview; a lightweight illustrative preview is acceptable if clearly illustrative. Do not require a second full live-map session to render the landing page.

## 2. Route composition

Proposed routes; record final route names before parallel implementation.

| Route | Composition |
|---|---|
| `/` | Marketing layout + hero/map preview + feature sections + CTA |
| `/map` | Explore controller + CampusMap + shared composer + compact SightingList + detail panel |
| `/feed` | PageContainer + SightingList + pagination |
| `/create` | PageContainer + SightingForm using the same PinPicker as Explore |
| `/sightings/[id]` | Sighting detail parts + photos + confirmation/owner actions + view-on-map link |
| `/profile/[id]` | Public identity summary + filtered SightingList |
| `/login`, `/signup` | Shared auth fields and form feedback; add callback route as required by selected auth method |
| `/how-it-works`, `/about`, `/for-students`, `/contact` | Shared marketing layout and reusable content blocks |

Contact needs a real destination and delivery decision before claiming a working form. Do not invent contact information or fake successful delivery. Auth/create/profile lack complete canonical screen designs: compose them from approved tokens/components and review mobile/desktop states at their milestone.

## 3. Data and state contracts before parallel work

The integration owner publishes the initial contracts and fixtures. Feature owners can propose changes, but consumers must not independently redefine them.

- `src/features/sightings/`: domain types, shared validation, queries, mutations, row-to-view-model mapping. Owns chronological pagination, creation, and deletion.
- `src/features/confirmations/`: nearby lookup, confirm/undo operations, eligibility responses.
- `src/features/map/`: lightweight marker queries, derived summaries, freshness, synchronization. Rendering stays in map components.
- `src/features/auth/`, `profiles/`, `locations/`: focused session, identity, and campus-location operations.
- `src/lib/supabase/`: browser/server integration. Database-generated types remain separate from UI view models.
- `src/types/`: only cross-feature contracts. Keep feature-local types in their feature.
- `src/test/fixtures/`: one shared set of illustrative sightings, including missing images, expired observations, overlaps, and confirmations; never ship these as production records.

Freeze the minimum shapes: SightingSummary, SightingDetail, MapMarkerSummary, SightingDraft, CampusLocation, AuthorSummary, paginated results, and safe mutation errors. Define photo references, nullable fields, observed versus created timestamps, confirmation summaries, and count estimate provenance explicitly. Map results expose truncation; incomplete data must not look like a complete estimate.

Agree callbacks for marker selection, pin change, form completion, and panel close. CampusMap receives typed marker data and emits interactions; it does not own auth or submission. The form receives the selected coordinates and retains its draft through pin picking and recoverable failures.

Route files handle routing and initial reads. Presentational components receive typed data. Keep map viewport, selection, and draft state local to their controller; use URL parameters for shareable selected-sighting/filter context where useful. Use one map subscription owner, reconcile by record ID, and refetch authoritative data after mutations/reconnect. Avoid a global store unless concrete cross-route needs justify one.

Routine operations can use Supabase directly under RLS. API.md describes logical contracts; do not build a redundant Next.js endpoint for every operation by default.

## 4. Build sequence and acceptance gates

### Wave 0 — Contracts and shared foundation

Integration owner defines route/component contracts, tokens, shell, initial UI primitives, shared fixtures, and working typecheck/test scripts. Read relevant installed Next.js guides before code changes. Reconcile affected older docs with D014/D015 when implementing those areas.

Exit: shell and representative sighting card/form-field states reviewed on phone and laptop; shared interfaces are usable by downstream agents; baseline lint/typecheck/test/build run, with any failures explicitly recorded.

### Wave 1 — First complete sighting slice

Parallel work after Wave 0:

1. Data/auth owner implements Supabase clients, migrations, RLS, profiles, locations, auth operations, sighting reads/create/delete, retry-safe submissions, photos and recoverable cleanup.
2. Map owner implements campus map, controls, pin placement, marker selection and responsive detail using shared fixtures/contracts.
3. Experience owner implements shared sighting displays, form, feed, detail, profile and auth UI against the same contracts.

Integration owner wires routes and real operations as deliverables arrive.

Exit: sign in, manually place a pin with GPS denied, submit animal/count with optional photo, see the same record on map/feed/profile/detail, delete it as its owner. A lost response/retry creates one sighting. A different user cannot delete it or alter its files. This is an internal working milestone, not the completed D015 release.

### Wave 2 — Complete accepted map behavior

- Data/auth owner: confirmation schema/RLS, nearby lookup, confirm/undo, authoritative related-report summaries and freshness contracts.
- Map owner: visual clusters, overlapping-report selection, realtime synchronization/reconnect, idle expiry, selection preservation, partial-data/connectivity states.
- Experience owner: Still there prompt/action/undo and count/presence presentation using shared components; then supporting marketing pages.
- Integration owner: finalize shared rule changes, connect confirmation effects across map/detail/feed, and exercise concurrent-device scenarios.

Exit: MAP_SPEC.md acceptance scenarios pass. Display clusters count reports; grouping for estimates is independent of zoom. Confirmations refresh presence without refreshing count observations. Historical sightings remain in the feed after map expiry.

### Wave 3 — Release verification

Integration owner reviews the assembled app against all design sheets, completes mobile and keyboard checks, runs quality gates, validates RLS/storage with anonymous and two authenticated identities, and verifies Vercel/Supabase deployment configuration. Complete contact delivery, content, metadata, and practical abuse handling before advertising those capabilities.

Exit: clean install and migrations are reproducible; lint/typecheck/test/build pass; critical flow works in the deployed environment; map-provider attribution/configuration and upload cleanup work; known limitations are documented.

## 5. Agent ownership and coordination

Use one integration owner plus at most three implementation agents. Assign by component/system boundary, not one agent per page. This section defines future assignments; it does not start agents.

| Owner | Exclusive write ownership during parallel waves |
|---|---|
| Integration owner | `src/app/**`, `src/components/ui/**`, `src/components/layout/**`, `src/types/**`, `src/test/fixtures/**`, package files, root/tooling config, shared docs, cross-feature E2E tests |
| Data/auth agent | `supabase/**`, `src/lib/supabase/**`, `src/features/auth/**`, `src/features/profiles/**`, `src/features/locations/**`, `src/features/sightings/**`, `src/features/confirmations/**` and their colocated tests |
| Map agent | `src/components/map/**`, `src/features/map/**`, `src/lib/map/**` and their colocated tests |
| Experience agent | `src/components/sightings/**`, `src/components/reporting/**`, `src/components/auth/**`, `src/components/profiles/**`, `src/components/marketing/**` and their colocated tests |

Map derivation functions owned by the map agent must remain framework-independent if invoked by server code. Data and map agents agree the authoritative query/derivation boundary before implementation; neither duplicates grouping or freshness rules.

Rules:

1. Start with contracts; each task specifies dependencies, files, exports, states, and acceptance criteria.
2. Only the integration owner changes shared contracts, dependencies/lockfile, route composition, or global styling during a parallel wave. Other agents request changes rather than editing these files.
3. Integrate small deliverables: first map display, then pin selection; first card/list, then form. Avoid waiting for three finished branches before discovering incompatible interfaces.
4. Prefer isolated worktrees for independently tested branches when available. With a shared checkout, ownership remains exclusive and agents must not commit unfinished shared work. Integrator runs full checks on the coherent assembled state.
5. Feature tests live with owned code. Integration owner owns cross-feature tests and browser acceptance checks. No separate QA agent is required to begin.
6. Handoff includes changed files, public interfaces, validation commands/results, assumptions, and blockers. Fixtures passing is not evidence that production integration works.
7. Commit one coherent feature/fix/migration at a time using path-specific staging and cached-diff review. Do not commit secrets, runtime config, dependencies, or build output.

### Reusable task brief

> Implement [bounded deliverable] within [owned paths]. Read AGENTS.md, src/AGENTS.md, relevant canonical docs/design sheets, and installed Next.js guides. Consume [named contracts] without redefining them. Deliver [exports and observable behavior], including mobile, keyboard, loading/empty/error states where applicable. Do not edit another owner's files; report required shared changes to the integrator. Verify [specific acceptance scenarios and relevant checks]. Report changed files, interfaces, tests, assumptions, and blockers. Do not expand scope to mockup-only features.

## 6. Decisions scheduled before affected implementation

These do not block planning or shared UI work. Proposed defaults in MAP_SPEC.md remain proposals until recorded as accepted.

| Before | Decisions needed |
|---|---|
| Auth/schema/storage | Auth method; public versus signed-in reads consistently across sightings/profiles/photos/realtime; animal values, limits, photo formats/size/count, metadata handling and cleanup |
| Production map and creation | Verified campus reporting bounds/locations; tile/style provider and attribution; observation-time bounds; submission ID enforcement and posting limits |
| Confirmation/estimate implementation | Matching distance/time, non-chaining grouping, count window, deterministic ties, repeated-author handling, compatibility of `other`, eligibility/lifetime and result caps |
| Contact/release | Real contact destination/delivery, practical moderation process, environment configuration |

Next implementation assignment: Wave 0 only. Once its shared pieces and contracts are reviewed, dispatch the three Wave 1 agents with non-overlapping ownership.
