# ADR-001: Hosting platform

## Status

Accepted (2026-05-29)

## Context

DocGenerator MVP requires:

- Next.js App Router (`apps/web`, `apps/api`)
- PostgreSQL via Prisma
- Puppeteer for PDF generation on staging/production
- Rate limiting (in-memory or Redis depending on instance count)

Vercel serverless has strict bundle limits for Chromium (`@sparticuz/chromium` ~50 MB compressed). Railway and similar PaaS run a long-lived Node process with full Chromium support.

## Decision

**Primary target for staging and production: Railway** (or equivalent single-instance Node hosting with native Chromium).

- Rate limiting MVP: `lru-cache` in-memory on a single instance.
- PostgreSQL: managed Postgres on the same platform or external provider.

**Vercel** remains a fallback only if we invest in Lambda Layer / Pro configuration for Chromium before PDF goes live; not the default path for MVP.

## Consequences

- Simpler PDF pipeline (standard Puppeteer) on Railway.
- Session store and rate limit can start in-memory (see ADR-002).
- If we later move to multi-instance Vercel Edge, plan migration to Upstash Redis for rate limit and sessions.

## References

- Unified plan: Phase 0 (ADR before Phase 3a backend/PDF)
- Master roadmap: ADR-001 recommendation
