---
name: fsd-conventions
description: >-
  Apply Feature-Sliced Design conventions for crm-payments web app. Use when
  adding or moving frontend code in apps/web, including pages, widgets,
  features, entities, and shared modules.
---

# FSD Conventions (crm-payments)

## Scope

Applies to `apps/web/src` with layers:

- `app`
- `pages`
- `widgets`
- `features`
- `entities`
- `shared`

Layer intent:

- `app`: app bootstrap and global runtime wiring.
- `pages`: route-level orchestration and composition.
- `widgets`: large reusable page blocks that compose features/entities.
- `features`: user interactions/business actions.
- `entities`: domain model, API, query hooks, domain UI.
- `shared`: generic UI kit, utilities, infra-agnostic helpers.

## Placement Rules

1. Put code in the lowest layer that owns the business meaning.
2. Keep page orchestration in `pages/*` (query composition, dialogs wiring, table config usage).
3. Use `widgets/*` for complex page zones (table+toolbar+dialogs blocks), then compose widgets in pages.
4. Put reusable business interactions in `features/*` (filters, create/edit actions, form flows).
5. Put domain models/api/hooks in `entities/*` (types, API client, query hooks, small domain UI).
6. Put pure reusable UI and utils in `shared/*` (ui-kit wrappers, generic hooks, helpers).

## App Layer Rules

- `app/*` owns global providers and app startup:
  - router setup
  - query client/provider
  - theme/provider
  - auth/session restore bootstrap
  - global styles import
- Do not place domain/business logic in `app`; move it to `features/entities`.
- Route guard wiring belongs to `app/router`, while permission rules are reusable logic in `features/auth` or `entities/session`.

## Widgets Rules

- Widget is a composite UI block for a page area (e.g., payments table section, sidebar area).
- Widgets may depend on `features`, `entities`, `shared`, but should not embed page-only route concerns.
- If a page section grows beyond simple composition, extract it to `widgets/*`.
- Prefer pages composing widgets instead of many direct feature imports when the page becomes dense.

## Dependency Direction

- Allowed: upper layer imports from lower layer.
- Avoid reverse imports (e.g., `entities` importing from `features` or `pages`).
- Avoid cross-imports between sibling features unless via explicit public API.

Preferred cross-slice communication:

- Downward via props/composition first.
- Shared server state via React Query cache/invalidation.
- Shared UI state only through explicit store slice when needed.
- Avoid hidden coupling through ad-hoc globals/event buses.

## Import And Alias Conventions

- Use alias imports from `@/` across the app (`@/features/...`, `@/entities/...`).
- Avoid deep relative imports across slices/layers (`../../../features/...`).
- Relative imports are acceptable only inside the same slice subtree.
- External slice access should go through slice public API (`index.ts`) when available.

## Public API Barrels

- Export feature/entity surface through `index.ts` at the slice root.
- Import from slice public API when possible:

  - good: `@/features/filter-payments`
  - avoid: deep internals from outside owning slice unless local to same slice.

## File-Level Conventions

- `entities/<name>/types.ts`: domain types and query params.
- `entities/<name>/api.ts|hooks.ts`: API calls and React Query hooks.
- `features/<name>/ui/*`: visual components for feature interaction.
- `pages/<route>/config/*`: columns/settings and page-level config.
- `pages/<route>/*Page.tsx`: orchestration only; extract reusable UI to feature/widget.

## State And Data Fetching

- Server state via React Query in `entities/*/hooks.ts`.
- Feature-local UI state in component/hook inside `features/*`.
- Do not duplicate server data in page state unless needed for transient UI behavior.
- For table filters:

  - filter state lives in page
  - filter UI lives in feature dialogs/components
  - query params typed in entity `types.ts`

## Forms Conventions

- Keep form feature logic in `features/*` (submit flow, side effects, UX states).
- Keep domain validation schemas close to ownership:
  - feature-specific form schema in `features/<name>/model`
  - reusable domain schema in `entities/<name>/model` or `types` area
- Place form UI fields/components in `features/<name>/ui`.
- Keep API DTO mapping at entity boundary (`entities/*`) or explicit adapter in feature.

## Errors, Loading, Notifications

- Reuse shared primitives for loading/error UI from `shared/ui`.
- Feature handles operation-level errors and success feedback (toasts).
- App-level fatal fallback/error boundary is configured in `app/*`.
- Do not duplicate toast logic in pages when feature already owns the action.

## Routing And Access

- Route definitions and guard composition live in `app/router`.
- Page should assume access already checked by route guard where possible.
- Role/permission checks used in UI actions can live in page/feature helper, but source role data comes from `entities/session`.

## Naming

- Slices: kebab-case (`filter-payments`, `manage-payment`).
- Components: PascalCase files (`PaymentAuthorFilterDialog.tsx`).
- Hooks: `useXxx` names in `hooks.ts` or local hook files.
- Keep names domain-specific; avoid vague `utils/helpers` in feature/entity slices.

## Constants And Enums

- Domain constants/enums live in owning entity (`entities/payment`, `entities/user`, etc.).
- Cross-domain generic constants live in `shared/config` or `shared/lib`.
- Do not keep domain enums in `shared` unless truly reused by multiple domains without ownership.

## Testing Conventions

- Keep tests close to source (`*.test.ts(x)` near component/hook/module) by default.
- Unit tests: `shared`, `entities`, `features` pure logic/hooks/components.
- Integration tests: `pages/widgets` composition and key user flows.
- Prefer user-centric tests for UI behavior; mock network at boundary hooks/API.

## UI/UX Consistency

- Reuse project primitives (`Button`, `Dialog`, `DataTable`, etc.) from `shared`/`components`.
- Reuse existing project utility hooks (e.g., debounced search) instead of ad-hoc implementations.
- Keep list filter patterns consistent across slices (trigger icon, dialog layout, apply/cancel flow).

## Pre-merge Checklist

- New code placed in correct FSD layer/slice.
- Imports follow dependency direction.
- Public exports updated in slice `index.ts`.
- Types/API/query hooks updated together when API contract changes.
- Lints pass on changed files.
