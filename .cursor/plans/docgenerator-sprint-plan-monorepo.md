# Sprint Plan — DocGenerator MVP (Monorepo)

Основано на: [docgenerator-master-roadmap-monorepo.plan.md](.cursor/plans/docgenerator-master-roadmap-monorepo.plan.md)

## Sprint 1 (Неделя 1): Foundation + Contract

### Цели
- Поднять монорепозиторий на `pnpm workspaces + turbo`.
- Подготовить `apps/web`, `apps/api`, `packages/shared`, `packages/config`.
- Зафиксировать единый контракт данных.

### Scope
- Этап 0: Foundation монорепозитория
- Этап 1: Скелет приложений и архитектурные границы
- Этап 2: Shared-контракт данных и моделирование домена

### Deliverables
- Рабочие команды: `pnpm turbo run lint typecheck build`.
- FSD-структура в `apps/web/src`.
- Server-структура в `apps/api/src/shared/lib/server`.
- Общие типы и константы в `packages/shared` без дублирования.

### Риски недели
- Ошибки workspace linking между пакетами.
- Конфликты tsconfig/eslint пресетов.

---

## Sprint 2 (Неделя 2): Core Backend + Core Frontend (параллельно)

### Цели
- Реализовать ключевую backend логику генерации.
- Реализовать ключевой frontend UX и роутинг.
- Подготовить обе стороны к интеграции.

### Scope
- Backend: Этап 3 (Prisma/seed/generate/pdf частично)
- Frontend: Этап 4 (роутинг + widgets/features)

### Deliverables (backend)
- Prisma schema + миграции + seed.
- `POST /api/generate` (filled/template).
- Базовый `POST /api/pdf` (минимально рабочий контур).

### Deliverables (frontend)
- Роутинг `/`, `/[category]`, `/[category]/[document]`, `/[category]/[document]/[variation]`.
- Document page с обязательным порядком блоков.
- `DocumentWidget`, `DocumentPreview`, `DownloadModal`, `RelatedDocs`, `TrustBadge`.

### Риски недели
- Расхождения contract/seed между `apps/api` и `apps/web`.
- UX баги mobile-first (видимость виджета, modal flow).

---

## Sprint 3 (Неделя 3): Integration + NFR + Release Gate

### Цели
- Замкнуть end-to-end поток web <-> api.
- Закрыть SEO, security, observability.
- Пройти финальный release checklist.

### Scope
- Этап 5: Интеграция web/api
- Этап 6: Нефункциональные требования
- Этап 7: Release gate

### Deliverables
- Frontend на `http-repository` без mock fallback по умолчанию.
- Полный сценарий: generate filled/template -> pdf download.
- SEO/Schema/robots/sitemap валидны.
- Rate limiting, healthcheck, logging, Sentry.
- Green pipeline: `pnpm turbo run lint typecheck build`.

### Риски недели
- Puppeteer в целевой среде.
- Регрессии при переключении mock -> http.

---

## Выходные критерии по спринтам
- Sprint 1 Done: monorepo и shared-контракт готовы.
- Sprint 2 Done: core-функциональность готова отдельно в web и api.
- Sprint 3 Done: интеграция, NFR и release gate закрыты.
