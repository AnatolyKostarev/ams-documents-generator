---
name: docgenerator-document-page
description: Build DocGenerator hub and variation pages with correct block order, metadata, breadcrumbs, and JSON-LD. Use when implementing or refactoring pages under src/app/[category]/[document] and src/app/[category]/[document]/[variation].
---

# DocGenerator Document Page

## Goal

Implement document pages with stable routing, SEO, and widget-first UX.

## Main Files

- `src/app/[category]/[document]/page.tsx`
- `src/app/[category]/[document]/[variation]/page.tsx`
- `src/components/DocumentWidget/index.tsx`
- `src/lib/mock.ts`
- `src/lib/schema.ts`

## Required Block Order

1. Breadcrumbs
2. `h1` from `titleH1`
3. Lead paragraph (adaptive mobile/desktop)
4. Trust badge
5. Document widget
6. Content block (`contentBody`)
7. FAQ
8. Related documents
9. CTA block
10. Disclaimer

## Metadata Rules

- Replace `{year}` in `metaTitle/metaDesc` with current year.
- Keep canonical URL aligned with route params.
- Return `notFound()` for invalid category/document/variation combinations.
- Keep route-specific metadata in `generateMetadata`.

## JSON-LD Rules

- Hub and variation pages require: `BreadcrumbList`, `FAQPage`, `HowTo`.
- Use shared builders from `src/lib/schema.ts`.

## Done Checklist

- Route resolves with `generateStaticParams`.
- Widget is visible before first scroll on narrow mobile screens.
- Breadcrumb path contains full hierarchy for variation pages.
- `relatedIds` do not render self-links in related block.
- Lint/build pass without errors.
