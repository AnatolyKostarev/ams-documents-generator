# Execution Checklist — DocGenerator MVP (Monorepo)

Основано на: [docgenerator-master-roadmap-monorepo.plan.md](.cursor/plans/docgenerator-master-roadmap-monorepo.plan.md)

## 0) Monorepo Foundation
- [ ] Настроен `pnpm-workspace.yaml`.
- [ ] Настроен root `package.json` со скриптами `dev/build/lint/typecheck/test`.
- [ ] Настроен `turbo.json` с pipeline и зависимостями задач.
- [ ] Создан `packages/config`.
- [ ] Создан `packages/shared`.
- [ ] Команда `pnpm turbo run lint typecheck build` запускается.

## 1) Apps Skeleton
- [ ] Поднят `apps/web` (Next.js App Router).
- [ ] Поднят `apps/api`.
- [ ] В `apps/web` создана FSD-структура `app/pages/widgets/features/entities/shared`.
- [ ] В `apps/api` создан server layout (`env/db/templates/ai/pdf/session/rate-limit`).
- [ ] Оба app используют пресеты из `packages/config`.

## 2) Shared Contract
- [ ] Типы `Category`, `FormField`, `FaqItem`, `DocumentData` определены в `packages/shared`.
- [ ] Контракт импортируется из `packages/shared` в `apps/web`.
- [ ] Контракт импортируется из `packages/shared` в `apps/api`.
- [ ] Нет дублирования этих типов в `apps/*`.

## 3) Backend Core
- [ ] Prisma schema поддерживает `parentId` self-relation.
- [ ] Миграции применяются без ошибок.
- [ ] Seed заполняет категории, хабы и спицы в правильном порядке.
- [ ] Реализован `templates` service (`getDocument/getVariation/getAllDocuments/getCategoryHubs`).
- [ ] Реализован `POST /api/generate` (`filled` + `template`).
- [ ] `template` режим не вызывает AI.
- [ ] Реализован `POST /api/pdf`.
- [ ] Единый дисклеймер подставляется в PDF.

## 4) Frontend Core
- [ ] Реализован 3-уровневый роутинг.
- [ ] Страницы используют page composition без перегруза route-файлов.
- [ ] Реализованы блоки document page в правильном порядке.
- [ ] Реализован `DocumentWidget` (`filled/template`).
- [ ] Реализован `DocumentPreview` (blur + copy).
- [ ] Реализован `DownloadModal`.
- [ ] Реализованы `TrustBadge`, `RelatedDocs`, `LeadParagraph`.
- [ ] На mobile widget виден до первого скролла.

## 5) Integration Web/API
- [ ] Frontend переведен на `http-repository` к `apps/api`.
- [ ] Обработаны ошибки API (`400/404/429/500`) в UI.
- [ ] End-to-end сценарий generate -> preview -> pdf работает.
- [ ] Smoke проверка variation URL без дублей/битых ссылок.

## 6) SEO + Security + Observability
- [ ] `generateMetadata` корректно формирует title/desc/canonical.
- [ ] Валидны `FAQPage`, `HowTo`, `BreadcrumbList`, `SoftwareApplication`, `WebSite/SearchAction`.
- [ ] `robots` и `sitemap` соответствуют требованиям MVP.
- [ ] `sitemap` использует `updatedAt`.
- [ ] Реализован rate limiting (11-й запрос -> 429).
- [ ] Реализован `/api/health`.
- [ ] Включены structured logs и Sentry.

## 7) Release Gate
- [ ] `pnpm turbo run lint` — green.
- [ ] `pnpm turbo run typecheck` — green.
- [ ] `pnpm turbo run build` — green.
- [ ] Rich Results проверки пройдены.
- [ ] JS-disabled проверка пройдена.
- [ ] LCP/базовые perf метрики соответствуют целям.
- [ ] MVP checklist полностью закрыт.

## Финальное DoD
- [ ] Frontend и backend работают как единая система в monorepo.
- [ ] Контракт централизован в `packages/shared`.
- [ ] FSD-границы в `apps/web` соблюдены.
- [ ] Основные пользовательские сценарии стабильны на staging.
