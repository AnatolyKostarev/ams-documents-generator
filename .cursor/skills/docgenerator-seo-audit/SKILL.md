---
name: docgenerator-seo-audit
description: Audit DocGenerator SEO readiness including metadata, robots, sitemap, and JSON-LD coverage for homepage, categories, and document routes. Use before release, after routing changes, or after content imports.
---

# DocGenerator SEO Audit

## Audit Targets

- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `generateMetadata` in category/document routes
- JSON-LD builders in `src/lib/schema.ts`

## Checklist

1. Titles/descriptions are unique and meaningful.
2. `{year}` placeholders are replaced at render time.
3. `robots` disallow includes technical paths and tracking query patterns.
4. Sitemap includes homepage, categories, hubs, and variations.
5. Sitemap uses document `updatedAt` as `lastModified`.
6. Only `published: true` documents are indexable and listed.

## Schema Coverage

- Homepage: `WebSite`, `SoftwareApplication`
- Category page: `BreadcrumbList` (+ `ItemList` if rendered)
- Document pages: `BreadcrumbList`, `FAQPage`, `HowTo`

## Route-Level Audit

- Homepage: `src/app/page.tsx`
- AI page: `src/app/ai-generator/page.tsx`
- Category page: `src/app/[category]/page.tsx`
- Hub document page: `src/app/[category]/[document]/page.tsx`
- Variation page: `src/app/[category]/[document]/[variation]/page.tsx`

## Exit Criteria

- Lint and build pass.
- No missing required schema blocks on target pages.
- Canonical, robots, and sitemap rules are consistent with published content.
