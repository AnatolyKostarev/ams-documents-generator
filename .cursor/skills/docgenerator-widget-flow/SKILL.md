---
name: docgenerator-widget-flow
description: Implement DocumentWidget mode switching and generation flow for filled/template modes with API integration and safe UX states. Use when editing DocumentWidget, generate/pdf API interaction, and related analytics hooks.
---

# DocGenerator Widget Flow

## Purpose

Keep a consistent generation UX for `filled` and `template` modes.

## Main Files

- `src/components/DocumentWidget/index.tsx`
- `src/app/api/generate/route.ts`
- `src/app/api/pdf/route.ts`
- `src/lib/analytics.ts` (when analytics is enabled)

## Workflow

1. Default mode is `filled`.
2. Mode switch does not reset form values.
3. `filled` mode sends form fields to `POST /api/generate`.
4. `template` mode calls `POST /api/generate` then `POST /api/pdf`.
5. Show clear states: `form`, `generating`, `preview`, `error`.

## UX Rules

- Privacy text is mandatory: "Данные используются только для генерации документа и не хранятся".
- Inputs should keep `font-size >= 16px` for iOS.
- Disable action button during generation.
- Error messages should be human-readable.

## API Expectations

- Generate response shape: `{ success, documentText, sessionId }`.
- Template mode must not call AI provider directly from client code.

## Analytics Events (minimum set)

- `mode_selected` with `mode`
- `form_start` with `document_slug`
- `doc_generated` with `document_slug`, `mode`
- `generate_error` with `document_slug`, `error_type`
- `copy_text` with `document_slug`
- `modal_open` with `document_slug`
- `download_app` with `document_slug`
- `download_pdf_only` with `document_slug`
- `modal_close` with `document_slug`

## Validation

- Test both modes manually on one hub and one variation page.
- Confirm download flow works for template mode.
- Confirm mode switch keeps form state.
- Confirm loading and error states are reachable and readable.
