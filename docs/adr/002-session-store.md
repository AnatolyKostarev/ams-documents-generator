# ADR-002: Session store for generate → PDF flow

## Status

Accepted (2026-05-29)

## Context

`POST /api/generate` returns a `sessionId`; `POST /api/pdf` loads document text by that id. Sessions must expire (TTL ~15 minutes). Store choice depends on hosting (ADR-001).

## Decision

**MVP (single-instance Railway):** `MapSessionStore` in `apps/api` — in-memory `Map` with TTL.

- No extra infrastructure for first release.
- **Expected behavior:** sessions and in-memory rate limits reset on deploy/restart; acceptable for MVP, documented in README.

**Production multi-instance or Vercel:** migrate to `UpstashSessionStore` (Redis) using the same interface:

```ts
interface SessionStore {
  set(id: string, data: GeneratedDoc, ttlSec: number): void
  get(id: string): GeneratedDoc | null
}
```

Implement the interface in `apps/api/src/shared/lib/server/session/` during Phase 4a.

## Consequences

- Fast local development without Redis.
- E2E on staging should use the same store implementation as production target.
- Switching implementations does not change API contract in `packages/shared`.

## References

- Unified plan: Phase 0 ADR, Phase 4a session implementation
- Skill: `docgenerator-widget-flow` (sessionId contract)
