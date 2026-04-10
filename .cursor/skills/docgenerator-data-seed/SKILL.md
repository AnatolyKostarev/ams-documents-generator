---
name: docgenerator-data-seed
description: Add or update DocGenerator document JSON seed data while preserving DocumentData compatibility and routing hierarchy. Use when creating new templates, categories, related links, or variation relations in src/data.
---

# DocGenerator Data Seed

## Scope

Manage data in `src/data/categories.json` and `src/data/documents/*.json`.

## Main Files

- `src/data/categories.json`
- `src/data/documents/*.json`
- `src/lib/mock.ts`
- `src/types/index.ts`

## Steps

1. Create or update category entry first (if needed).
2. Add hub document (`parentSlug: null`) before variations.
3. Add variation documents with valid `parentSlug`.
4. Ensure all required fields exist and match the contract.
5. Update `relatedIds` with existing slugs only.

## Contract Requirements

- Required SEO fields: `titleH1`, `metaTitle`, `metaDesc`.
- Required legal/content fields: `legalBasis`, `templateBody`, `contentBody`, `faq`.
- Required control fields: `priority`, `published`, `createdAt`, `updatedAt`.

## Quality Rules

- Keep slugs unique and URL-safe.
- Keep category and parent references valid.
- Publish only ready content (`published: true`).

## Verification

- Run lint and build.
- Confirm route appears in `sitemap.xml` when `published: true`.

## Validation Loop

1. Collect all document slugs and check uniqueness.
2. Check every `categorySlug` exists in categories list.
3. Check every non-null `parentSlug` points to an existing hub slug.
4. Check every `relatedIds[]` value exists among document slugs.
5. Rebuild and verify hub/variation routes generate successfully.
