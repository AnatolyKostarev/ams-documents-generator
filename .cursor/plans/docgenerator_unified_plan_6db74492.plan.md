---
name: DocGenerator Unified Plan
overview: "Единый план реализации DocGenerator MVP в монорепозитории (pnpm + turbo): apps/web + apps/api + packages/shared, объединяющий четыре исходных плана, оценки 147–175 ч (последовательно) или ~118–142 ч при параллели после этапа контракта, с привязкой к .cursor/rules и skills."
todos:
  - id: phase-0-foundation
    content: "Этап 0: pnpm/turbo, packages/config, packages/shared каркас, ADR хостинг + session store (6–8ч)"
    status: completed
  - id: phase-1-skeleton
    content: "Этап 1: apps/web FSD + apps/api server conventions, подключение config (10–12ч)"
    status: completed
  - id: phase-2-contract
    content: "Этап 2: packages/shared контракт + Zod, mock repos + JSON seed, валидация data-contract (9–11ч)"
    status: completed
  - id: phase-3a-backend-db
    content: "Этап 3a: Prisma schema, миграции, seed синхронный с shared/mock (22–25ч)"
    status: pending
  - id: phase-3b-frontend-routing
    content: "Этап 3b: App Router 3 уровня, generateStaticParams, pages composition (11–13ч)"
    status: pending
  - id: phase-4a-backend-api
    content: "Этап 4a: templates service, /api/generate, /api/pdf, rate limit, health (25–29ч)"
    status: pending
  - id: phase-4b-frontend-widgets
    content: "Этап 4b: document-page блоки, DocumentWidget, preview, download flow (16–18ч)"
    status: pending
  - id: phase-5-seo
    content: "Этап 5: metadata, JSON-LD, robots, sitemap, turbo quality-gates (10–12ч)"
    status: pending
  - id: phase-6-integration
    content: "Этап 6: http-repository, env переключение mock/http, E2E smoke web↔api (13–15ч)"
    status: pending
  - id: phase-7-release
    content: "Этап 7: аналитика, тесты, Lighthouse/SEO audit, release DoD (12–14ч)"
    status: pending
isProject: false
---

# Единый план реализации DocGenerator MVP

## Источники и решения

Объединены:
- [docgenerator-backend-implementation_cb110c53.plan.md](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/plans/docgenerator-backend-implementation_cb110c53.plan.md)
- [docgenerator-backend-step-by-step-estimate_2bdb7f9b.plan.md](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/plans/docgenerator-backend-step-by-step-estimate_2bdb7f9b.plan.md)
- [docgenerator-frontend-implementation_55da44f8.plan.md](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/plans/docgenerator-frontend-implementation_55da44f8.plan.md)
- [docgenerator-frontend-step-by-step-estimate_62870420.plan.md](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/plans/docgenerator-frontend-step-by-step-estimate_62870420.plan.md)

**Зафиксированная архитектура (по вашему выбору):** split-монорепо — `apps/web`, `apps/api`, `packages/shared`, `packages/config`.

**Текущее состояние репозитория:** в основном планы и `.cursor/*`; прикладной код ещё не поднят — старт с этапа 0.

**Конфликт с [docgenerator-master-roadmap-monorepo.plan.md](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/plans/docgenerator-master-roadmap-monorepo.plan.md):** master-roadmap ориентирован на один `apps/web` (API в Route Handlers). Этот план следует split-модели из четырёх анализируемых планов; при необходимости позже `apps/api` можно свернуть в `apps/web` без смены контракта в `packages/shared`.

---

## Целевая структура

```text
ams-documents-generator/
├── apps/web/          # Next.js App Router, FSD, SEO, UI
├── apps/api/          # Next.js API (generate, pdf, health)
├── packages/shared/   # DocumentData, Zod DTO, disclaimer, API types
├── packages/config/   # eslint/tsconfig/prettier presets
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Сводная оценка (после дедупликации)

| Режим                                         | База (ч) | С буфером 20% (ч) | Календарь (8 ч/день) |
| --------------------------------------------- | -------- | ----------------- | -------------------- |
| **Последовательно** (1 исполнитель)           | 147      | **176–180**       | ~22–23 дня           |
| **Параллельно** (2 исполнителя после этапа 2) | 118      | **141–145**       | ~18 дней             |

Дедупликация: bootstrap монорепо (−7 ч), общий контракт в одном этапе (−3 ч), интеграция web↔api считается один раз (−7 ч).

Риски (уже в буфере): turbo/workspace links, Puppeteer на хостинге, Anthropic timeouts, расхождение seed и mock JSON.

---

## Локальная БД (PostgreSQL)

### Когда нужна

| Этап | PostgreSQL |
| ---- | ---------- |
| 0–2 (монорепо, mock JSON) | **Не нужна** |
| 3a и далее (Prisma, seed, API с БД, интеграция) | **Обязательна** |
| 3b–4b (только frontend на mock) | **Не нужна**, если backend не запускается |

Поднимать БД **перед стартом этапа 3a**, не раньше.

### Почему только PostgreSQL

- Prisma-схема с JSON-полями (`formFields`, `faq`) должна быть **одинаковой** в dev, staging и production.
- SQLite в планах **не используется** — расхождение миграций dev/prod (см. [master-roadmap](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/plans/docgenerator-master-roadmap-monorepo.plan.md)).

### Рекомендуемый способ: Docker Compose

На этапе 3a (подэтап «Инфра») добавить в корень репозитория:

- `docker-compose.yml` — сервис `postgres` (образ `postgres:16-alpine` или LTS-версия команды).
- `.env.example` — шаблон без секретов.
- `apps/api/.env` (локально, в `.gitignore`) — рабочие переменные.

**Целевые параметры dev (пример):**

| Параметр | Значение |
| -------- | -------- |
| Host | `localhost` |
| Port | `5432` |
| Database | `docgenerator` |
| User / password | `docgenerator` / `docgenerator` (только для dev) |

**`DATABASE_URL` для `apps/api`:**

```text
postgresql://docgenerator:docgenerator@localhost:5432/docgenerator
```

**Минимальный workflow (после появления `docker-compose.yml` и Prisma):**

```bash
docker compose up -d
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed
```

Проверка: `pnpm prisma studio` или `GET /api/health` (после этапа 4a) с проверкой подключения к БД.

### Альтернатива без Docker

Допустима **установленная локально** PostgreSQL (Windows installer, WSL2, pgAdmin). Требования те же: создать БД `docgenerator`, пользователя с правами, прописать `DATABASE_URL` в `apps/api/.env`. Docker остаётся рекомендуемым вариантом для единообразия в команде.

### Что не коммитить

- `apps/api/.env` и любые файлы с реальными паролями.
- Данные volume Docker (`postgres_data`) — только локально.

### Связь с этапами плана

- **Этап 3a, инфра:** `docker-compose.yml`, валидация `DATABASE_URL` в `env.ts`, `db.ts` singleton.
- **Этап 3a, schema/seed:** миграции и наполнение БД из mock/JSON.
- **Этап 6:** `apps/web` при `DATA_SOURCE=http` читает данные через `apps/api`, БД должна быть запущена и засеяна.
- **Этап 7:** E2E smoke на staging — отдельный PostgreSQL хостинга; локальная БД для Playwright опциональна, если тесты гоняются против локального `apps/api`.

### Чеклист «БД готова к разработке»

- [ ] Docker Desktop (или локальный PostgreSQL) запущен.
- [ ] `docker compose up -d` — контейнер `healthy`.
- [ ] `apps/api/.env` содержит валидный `DATABASE_URL`.
- [ ] `pnpm prisma migrate dev` прошёл без ошибок.
- [ ] `pnpm prisma db seed` — категории и документы в БД, консистентны с mock JSON.

---

## Карта rules и skills по этапам

Использовать [rules-skills-matrix.md](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/rules-skills-matrix.md):

| Этап                    | Rules (alwaysApply)                                                                                                              | Primary skills                                                                                                                                                                                                                                                       | Secondary                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 0–1 Foundation          | [commit-and-push-policy](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/rules/commit-and-push-policy.mdc)   | —                                                                                                                                                                                                                                                                    | —                                                            |
| 2 Контракт и данные     | [data-contract-documents](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/rules/data-contract-documents.mdc) | [docgenerator-data-seed](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/skills/docgenerator-data-seed/SKILL.md)                                                                                                                                 | —                                                            |
| 3a Backend DB           | data-contract                                                                                                                    | docgenerator-data-seed                                                                                                                                                                                                                                               | —                                                            |
| 3b–4b Frontend pages/UI | [architecture-routing](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/rules/architecture-routing.mdc)       | [docgenerator-document-page](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/skills/docgenerator-document-page/SKILL.md), [fsd-conventions](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/skills/fsd-conventions/SKILL.md) | nextjs-app-router-fundamentals, nextjs-dynamic-routes-params |
| 4a Backend API          | data-contract                                                                                                                    | [docgenerator-widget-flow](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/skills/docgenerator-widget-flow/SKILL.md), [vercel-ai-sdk](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/skills/vercel-ai-sdk/SKILL.md)         | nextjs-advanced-routing                                      |
| 4b Widget flow          | seo-schema (дисклеймер)                                                                                                          | docgenerator-widget-flow                                                                                                                                                                                                                                             | docgenerator-document-page                                   |
| 5 SEO                   | [seo-schema-standards](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/rules/seo-schema-standards.mdc)       | [docgenerator-seo-audit](c:/Users/Admin/Desktop/dev/Projects/ams-documents-generator/.cursor/skills/docgenerator-seo-audit/SKILL.md)                                                                                                                                 | docgenerator-document-page                                   |
| 6 Интеграция            | все четыре rules                                                                                                                 | docgenerator-widget-flow                                                                                                                                                                                                                                             | docgenerator-seo-audit                                       |
| 7 Release gate          | все                                                                                                                              | docgenerator-seo-audit                                                                                                                                                                                                                                               | —                                                            |

**Порядок применения skills на задачу:** data-seed → document-page → widget-flow → seo-audit.

---

## Логическая последовательность (7 этапов)

```mermaid
flowchart TD
  E0[Этап0_Foundation]
  E1[Этап1_Apps_Skeleton]
  E2[Этап2_Shared_Contract]
  E3a[Этап3a_Backend_DB]
  E3b[Этап3b_Frontend_Routing]
  E4a[Этап4a_Backend_API]
  E4b[Этап4b_Frontend_Widgets]
  E5[Этап5_SEO]
  E6[Этап6_Integration]
  E7[Этап7_QA_Release]

  E0 --> E1 --> E2
  E2 --> E3a
  E2 --> E3b
  E3a --> E4a
  E3b --> E4b
  E4b --> E5
  E4a --> E6
  E5 --> E6
  E6 --> E7
```

---

### Этап 0. Foundation монорепозитория (6–8 ч)

**Цель:** единый pipeline для всех пакетов.

**Действия:**
- `pnpm-workspace.yaml`, root `package.json`, `turbo.json` (`dev`, `lint`, `typecheck`, `build`, `test`).
- Создать [packages/config](packages/config) и каркас [packages/shared](packages/shared).
- Зафиксировать ADR: хостинг (Railway vs Vercel — влияет на Puppeteer и rate limit) и session store (in-memory vs Upstash).

**Результат:** `pnpm turbo run lint typecheck build` проходит на пустых/минимальных пакетах.

**Зависимости:** нет.

---

### Этап 1. Скелет приложений (10–12 ч)

**Цель:** два приложения с согласованными conventions.

**apps/web (6–7 ч):**
- Next.js App Router, FSD: `src/app`, `views` (слой pages), `widgets`, `features`, `entities`, `shared`.
- Alias `@/*`, ESLint-ограничения cross-layer (skill `fsd-conventions`).
- Подключить `packages/config`.

**apps/api (4–5 ч):**
- Next.js API-приложение, структура `src/shared/lib/server/`: `env`, `db`, `templates`, `ai`, `pdf`, `session`, `rate-limit`.
- Импорт типов только из `packages/shared`.

**Результат:** оба приложения стартуют; границы слоёв зафиксированы.

**Зависимости:** этап 0. **Параллель:** web и api после этапа 0.

---

### Этап 2. Единый контракт и mock-данные (9–11 ч)

**Цель:** один источник правды для frontend и backend (rule `data-contract-documents`).

**packages/shared:**
- `Category`, `FormField`, `FaqItem`, `DocumentData`.
- Zod-схемы для `POST /api/generate` и `POST /api/pdf`.
- Общий текст дисклеймера (согласован с PDF и страницами — rule `seo-schema-standards`).

**apps/web (mock до БД):**
- `entities/document/api/mock-repository.ts`, `entities/category/api/mock-repository.ts`.
- JSON: `shared/data/categories.json`, `shared/data/documents/*.json`.
- Поля: `parentId`, `titleGen`, `metaTitle`, `metaDesc`, `legalBasis`, `contentBody`, `updatedAt`, `published`, `relatedIds`.
- Интерфейс репозитория: `DocumentRepository` / `CategoryRepository` для переключения `mock → http`.

**Проверки (skill `docgenerator-data-seed`):**
- Уникальные `slug`, валидные `relatedIds`, `parentId` → существующий hub, без cross-category parent-child.

**Результат:** типобезопасный контракт; mock покрывает 3-уровневую иерархию hub/variation.

**Зависимости:** этап 1. **Блокирует** этапы 3a, 3b.

---

### Этап 3a. Backend: Prisma и seed (22–25 ч) — параллельно с 3b

> **Перед стартом:** поднять локальную PostgreSQL по разделу [Локальная БД (PostgreSQL)](#локальная-бд-postgresql).

**Подэтапы (из BE-плана):**
1. **Инфра (6–7 ч):** Prisma + PostgreSQL, `env.ts` (Zod), `db.ts` singleton, `docker-compose.yml` и `.env.example` (см. раздел «Локальная БД»).
2. **Schema (8–9 ч):** `Category`, `Document`, self-relation `parentId`, индексы `slug`, `published`, `categoryId` — [apps/api/prisma/schema.prisma](apps/api/prisma/schema.prisma).
3. **Seed (8–9 ч):** порядок categories → hubs (`parentId: null`) → variations; синхронизация с `packages/shared` и web JSON.

**Результат:** миграции применены, seed консистентен с mock.

**Зависимости:** этап 2.

---

### Этап 3b. Frontend: роутинг и page orchestration (11–13 ч) — параллельно с 3a

**Маршруты (rule `architecture-routing`):**
- `app/page.tsx`, `app/[category]/page.tsx`, `app/[category]/[document]/page.tsx`, `app/[category]/[document]/[variation]/page.tsx`, `app/ai-generator/page.tsx`, `not-found.tsx`.
- Тонкие route-файлы; композиция в `pages/*`.
- `generateStaticParams`, `notFound()` для невалидных комбинаций.
- URL только через helpers (`category.slug`, `hub.slug`, `variation.slug`).

**Источник данных на этом этапе:** mock-repository.

**Результат:** все published-маршруты открываются; breadcrumbs для variation — полная цепочка.

**Зависимости:** этап 2. **Skill:** `docgenerator-document-page`, `nextjs-dynamic-routes-params`.

---

### Этап 4a. Backend: generate, pdf, security (25–29 ч)

**Подэтапы:**
1. **templates.ts (часть шага 5):** `getDocument`, `getVariation`, `getAllDocuments`, `getCategoryHubs` + include category/parent/children.
2. **POST /api/generate (10–12 ч):** Zod + sanitize; `filled` → Anthropic `claude-haiku-4-5-20251001`; `template` → подчёркивания без AI; ответ `{ success, documentText, sessionId }`; session store.
3. **POST /api/pdf (8–9 ч):** текст по `sessionId`, Puppeteer HTML→PDF, дисклеймер из shared; dev-stub без Chromium.
4. **NFR (7–8 ч):** rate limit 10/мин → 429; `/api/health`; карта ошибок 400/404/429/500; structured logs; Sentry — по желанию post-MVP.

**Ключевые файлы:**
- [apps/api/src/app/api/generate/route.ts](apps/api/src/app/api/generate/route.ts)
- [apps/api/src/app/api/pdf/route.ts](apps/api/src/app/api/pdf/route.ts)
- `templates.ts`, `ai.ts`, `pdf.ts`

**Skills:** `docgenerator-widget-flow`, `vercel-ai-sdk`.

**Зависимости:** этап 3a.

---

### Этап 4b. Frontend: виджеты и product flow (16–18 ч)

**Порядок блоков страницы (skill `docgenerator-document-page`):**
Breadcrumbs → H1 → Lead (mobile-short/desktop-full) → TrustBadge → DocumentWidget → contentBody → FAQ → Related → CTA → Disclaimer.

**Компоненты:**
- `widgets/document-page/*`
- `features/document-generate` — режимы `filled|template`, state machine, loading/error
- `features/document-download` — modal, app/pdf actions
- `entities/document/ui/DocumentPreview` — blur, copy, toast

**UX (skill `docgenerator-widget-flow`):**
- Widget виден до первого скролла на 375px; inputs ≥16px; поля не сбрасываются при смене режима; privacy-текст обязателен.
- Пока API в mock: локальные handlers или прямые вызовы mock — **без** прямого вызова AI с клиента.

**Зависимости:** этап 3b.

---

### Этап 5. SEO, schema, quality gates (10–12 ч)

**По rule `seo-schema-standards` и skill `docgenerator-seo-audit`:**
- `generateMetadata` + `{year}` + canonical на category/hub/variation.
- JSON-LD: homepage `WebSite`+`SearchAction`, `SoftwareApplication`; category `BreadcrumbList`+`ItemList`; document `BreadcrumbList`, `FAQPage`, `HowTo`.
- `robots.ts`: disallow `/api/`, `/admin/`, `/cabinet/`, `/*?sort=`, `/*?utm_`, `/*?ref=`.
- `sitemap.ts`: только `published: true`, `lastModified` из `updatedAt`.
- Дисклеймер на странице = текст в PDF.
- `pnpm turbo run lint typecheck build --filter=web...`

**Зависимости:** этапы 3b–4b (можно начинать metadata параллельно с 4b после стабильных маршрутов).

---

### Этап 6. Интеграция web ↔ api (13–15 ч)

**Цель:** снять mock на данных и API без рефакторинга widgets/pages (FSD).

**Действия:**
- `http-repository` в `entities/*/api` → `apps/api` (env `NEXT_PUBLIC_API_URL` или proxy).
- Feature-flag / env: `DATA_SOURCE=mock|http`.
- Sitemap/metadata читают backend (`updatedAt`, `published`).
- Smoke E2E: generate filled/template, pdf download, 404, 429.
- `pnpm turbo run lint typecheck build` на affected packages.

**Зависимости:** этапы 4a, 5 (frontend SEO может догонять).

---

### Этап 7. QA, аналитика, release gate (12–14 ч)

**Аналитика (10 событий):** `mode_selected`, `form_start`, `doc_generated`, `generate_error`, `cta_click`, `modal_open`, `download_app`, `download_pdf_only`, `modal_close`, `copy_text` — [apps/web/src/shared/lib/analytics](apps/web/src/shared/lib/analytics).

**Проверки:**
- JS-disabled readability
- Lighthouse / LCP ≤ 2.5s (цель MVP)
- Rich Results / schema validators
- Unit: Zod в `packages/shared`, sanitize
- Integration: generate (mock AI), pdf (mock Puppeteer), rate limit
- Playwright smoke на staging

**Definition of Done (объединённый):**
- 3-уровневый роутинг hub/variation стабилен; `generateStaticParams` для всех published.
- Контракт только в `packages/shared`; UI не дублирует типы.
- `/api/generate` и `/api/pdf` стабильны; `template` без Anthropic.
- SEO: metadata, robots, sitemap, JSON-LD на всех типах страниц.
- Rate limit и health на staging; переход mock→http через репозитории.
- `pnpm turbo run lint typecheck build test` зелёный.

---

## Рекомендуемые итерации (календарь)

| Неделя | Фокус                        | Этапы   |
| ------ | ---------------------------- | ------- |
| 1      | Foundation + контракт        | 0, 1, 2 |
| 2      | Параллель: DB/seed + роутинг | 3a ‖ 3b |
| 3      | Параллель: API + виджеты     | 4a ‖ 4b |
| 4      | SEO + интеграция + QA        | 5, 6, 7 |

При **одном** исполнителе: этапы 3a→4a→3b→4b→5→6→7 (backend-first для раннего API-контракта) или 3b→4b→3a→4a при UI-first — критический путь длиннее на ~25–30 ч.

---

## Критический путь

`0 → 1 → 2 → max(3a→4a, 3b→4b→5) → 6 → 7`

Узкое место при параллели: **frontend 4b+5 (26–30 ч)** vs **backend 3a+4a (47–54 ч)** — backend завершится раньше; имеет смысл усилить frontend на неделях 2–3.

---

## Отличия от дублирующих планов (что объединено)

- Bootstrap и `packages/shared` — **один этап 0–2**, не два раза в BE/FE.
- Интеграция — **один этап 6**, не BE step 8 + FE step 6 отдельно в оценке.
- Rules/skills встроены в этапы, а не отдельным чеклистом.
- Master-roadmap ТЗ (20 документов, 2-уровневый URL в ТЗ) vs 3-уровневый в rules: **приоритет у `.cursor/rules`** (hub + variation); seed должен покрывать оба уровня для SEO-структуры из rules.
