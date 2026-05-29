# AMS Documents Generator

Монорепозиторий DocGenerator MVP: `apps/web`, `apps/api`, `packages/shared`, `packages/config`.

## Требования

- Node.js ≥ 20
- [pnpm](https://pnpm.io/) 9.x (`corepack enable` рекомендуется)

## Быстрый старт

```bash
pnpm install
pnpm run build
pnpm run lint
pnpm run typecheck
pnpm run test
```

## Скрипты (корень)

| Команда | Описание |
| ------- | -------- |
| `pnpm dev` | Turbo: dev во всех пакетах с задачей `dev` |
| `pnpm build` | Сборка workspace |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Тесты (Vitest) |
| `pnpm format` | Prettier |

## Структура

```text
apps/web/           # Frontend (Next.js, FSD; views = page layer) — :3000
apps/api/           # Backend API (Next.js) — :3001
packages/shared/    # Общий контракт данных и API DTO
packages/config/    # ESLint, Prettier, TSConfig presets
docs/adr/           # Architecture Decision Records
```

## Dev-серверы (этап 1+)

```bash
pnpm install
pnpm dev              # web :3000 + api :3001 (turbo)
pnpm --filter @docgenerator/web dev
pnpm --filter @docgenerator/api dev
```

[API health](http://localhost:3001/api/health)

## Локальная БД

PostgreSQL нужна с **этапа 3a** (Prisma). До этого достаточно mock-данных. См. раздел «Локальная БД» в [едином плане](.cursor/plans/docgenerator_unified_plan_6db74492.plan.md).

## ADR

- [ADR-001: Hosting](docs/adr/001-hosting-platform.md) — Railway для MVP + Puppeteer
- [ADR-002: Session store](docs/adr/002-session-store.md) — in-memory Map, затем Upstash при multi-instance

## AI rules и skills

- Политика коммитов: `.cursor/rules/commit-and-push-policy.mdc`
- Матрица rules ↔ skills: `.cursor/rules-skills-matrix.md`
- Skills: `.cursor/skills/`
- Единый план: `.cursor/plans/docgenerator_unified_plan_6db74492.plan.md`
