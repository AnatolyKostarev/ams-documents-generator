---
name: docgenerator-backend-step-by-step-estimate
overview: Детализированный пошаговый план backend-реализации DocGenerator MVP в монорепозитории (pnpm workspaces + turbo) с оценкой трудозатрат, зависимостями этапов и порядком интеграции с frontend.
todos:
  - id: be-mono-step0
    content: Инициализировать monorepo-infra (pnpm workspaces + turbo + shared packages) (6–8ч)
    status: pending
  - id: be-mono-step1
    content: Поднять apps/api и базовые server conventions (4–5ч)
    status: pending
  - id: be-mono-step2
    content: Настроить Prisma/PostgreSQL, env validation, db singleton (6–7ч)
    status: pending
  - id: be-mono-step3
    content: Реализовать Prisma schema + миграции для Category/Document/self-relation (8–9ч)
    status: pending
  - id: be-mono-step4
    content: Собрать seed-слой, синхронизированный с packages/shared и frontend данными (8–9ч)
    status: pending
  - id: be-mono-step5
    content: Реализовать templates/query service и API /api/generate (10–12ч)
    status: pending
  - id: be-mono-step6
    content: Внедрить /api/pdf, сессии, disclaimer и dev fallback (8–9ч)
    status: pending
  - id: be-mono-step7
    content: Добавить rate limiting, healthcheck, error map, logging/sentry (7–8ч)
    status: pending
  - id: be-mono-step8
    content: Интегрировать apps/web с apps/api через shared-контракт и turbo quality-gates (7–8ч)
    status: pending
isProject: false
---

# Пошаговый план реализации Backend (с оценкой) — DocGenerator MVP (Monorepo)

## Контекст
Основан на текущем плане: [docgenerator-backend-implementation_cb110c53.plan.md](.cursor/plans/docgenerator-backend-implementation_cb110c53.plan.md). Ниже — практический execution-план с временной оценкой и критическим путем.
Целевая структура монорепозитория:
- `apps/web` — frontend
- `apps/api` — backend
- `packages/shared` — общие типы/схемы/константы
- `packages/config` — общие lint/tsconfig/prettier настройки

## Итоговая оценка
- Базовая оценка: **64–75 часов**
- Буфер рисков (20%): **13–15 часов**
- Итого: **77–90 часов** (примерно 10–12 рабочих дней)

## Последовательность внедрения

### Шаг 0. Bootstrap монорепозитория и pipeline (6–8ч)
- Настроить `pnpm-workspace.yaml`, root scripts и `turbo.json`.
- Подключить pipeline задач (`lint`, `typecheck`, `build`, `dev`) для `apps/*` и `packages/*`.
- Создать `packages/config` и подключить пресеты в `apps/api` и `apps/web`.
- Создать каркас `packages/shared` для общего контрактного слоя.

Результат:
- Monorepo готов к масштабированию, все проекты используют единый build/lint pipeline.

Зависимости:
- Нет.

---

### Шаг 1. Подъем `apps/api` и server conventions (4–5ч)
- Развернуть backend-приложение в `apps/api`.
- Подготовить структуру server-модулей (`env/db/templates/ai/pdf/session/rate-limit`).
- Зафиксировать правила импорта из `packages/shared` для контрактных типов.

Результат:
- Backend-слой организован и готов к подключению БД/API.

Зависимости:
- Требует шага 0.

---

### Шаг 2. Инфраструктура БД и окружений (6–7ч)
- Подключить Prisma + PostgreSQL.
- Реализовать `env.ts` c Zod-валидацией обязательных переменных.
- Реализовать `db.ts` (Prisma singleton для dev/prod).
- Добавить workspace-команды запуска/миграции и документацию в root README.

Результат:
- Рабочее окружение backend и предсказуемая инициализация БД.

Зависимости:
- Требует шага 1.

---

### Шаг 3. Prisma schema и миграции (8–9ч)
- Описать модели `Category` и `Document` с полной SEO/контент-моделью.
- Добавить self-relation `parentId` для hub/variation и индексы по критичным полям (`slug`, `published`, `categoryId`).
- Выполнить миграцию и smoke-check схемы.

Результат:
- Стабильный контракт хранения данных для 3-уровневого роутинга и sitemap.

Зависимости:
- Требует шага 2.

---

### Шаг 4. Seed-слой и синхронизация с shared/frontend (8–9ч)
- Реализовать `prisma/seed.ts` с правильным порядком (категории -> хабы -> спицы).
- Добавить 7 категорий и документы с полями расширенной модели.
- Сверить seed-контракт с `packages/shared` и данными frontend.
- Проверить консистентность `parentId/parentSlug`, `published`, `updatedAt`.

Результат:
- База заполнена валидными данными, совместимыми с frontend-моками.

Зависимости:
- Требует шага 3.

---

### Шаг 5. Сервис шаблонов и API `/api/generate` (10–12ч)
- Реализовать `templates.ts`: `getDocument`, `getVariation`, `getAllDocuments`, `getCategoryHubs`.
- Встроить include для `category/parent/children`.
- Убедиться, что сервис покрывает нужды страниц, sitemap и API без повторения логики.
- Реализовать входную Zod-валидацию и sanitize полей.
- `filled`: вызов Anthropic модели `claude-haiku-4-5-20251001`.
- `template`: подстановка подчеркиваний без AI.
- Сохранять результат в session-store, возвращать единый контракт ответа.

Результат:
- Готов data-access слой и основной endpoint генерации для frontend-режимов.

Зависимости:
- Требует шагов 2 и 4.

---

### Шаг 6. API `/api/pdf`, сессии и дисклеймер (8–9ч)
- Реализовать получение текста по `sessionId`.
- Собрать HTML-шаблон и генерацию PDF через Puppeteer.
- Подключить единый дисклеймер из `constants.ts`.
- Добавить dev-fallback (stub) на случай локальных ограничений Chromium.

Результат:
- Сквозной путь «сгенерировать -> скачать PDF» работает end-to-end.

Зависимости:
- Требует шага 5.

---

### Шаг 7. Безопасность, лимиты и observability (7–8ч)
- Rate limiting (порог 10/мин, 11-й -> 429), сначала in-memory, затем Redis.
- Единая карта ошибок 400/404/429/500.
- `/api/health`, structured logging, интеграция Sentry.

Результат:
- Backend готов к staging-нагрузке и контролируемому мониторингу.

Зависимости:
- Требует шагов 5–6.

---

### Шаг 8. Интеграция `apps/web` <-> `apps/api` через shared + turbo (7–8ч)
- Перевести frontend на HTTP-repository без изменений widgets/pages логики.
- Проверить, что sitemap/metadata/SEO-контуры читают актуальные backend-данные.
- Прогнать `pnpm turbo run lint typecheck build` и E2E smoke по ключевым сценариям.
- Провести smoke E2E: generate filled/template, pdf download, ошибки и 429.

Результат:
- Переход с mock на backend завершен без архитектурного долга по FSD.

Зависимости:
- Требует завершения шагов 4–7.

## Критический путь
`Шаг 0 -> Шаг 1 -> Шаг 2 -> Шаг 3 -> Шаг 4 -> Шаг 5 -> Шаг 6 -> Шаг 7 -> Шаг 8`

## Расклад по итерациям
- Итерация 1 (День 1): Шаги 0–1
- Итерация 2 (День 2): Шаг 2
- Итерация 3 (День 3): Шаг 3
- Итерация 4 (Дни 4–5): Шаг 4
- Итерация 5 (Дни 6–7): Шаг 5
- Итерация 6 (День 8): Шаг 6
- Итерация 7 (День 9): Шаг 7
- Итерация 8 (Дни 10–11): Шаг 8 + буфер

## Основные риски и резерв
- Риски monorepo bootstrap (turbo pipeline, workspace links, shared versioning): +3–4ч
- Puppeteer в целевой среде (особенно serverless): +4ч
- Таймауты/ошибки Anthropic: +2–3ч
- Несовпадения seed и frontend-моков: +2ч
- Эти риски заложены в общий 20% буфер.

## Критерии завершения
- Prisma-модель и seed полностью поддерживают 3-уровневую иерархию.
- Контракты типов/схем централизованы в `packages/shared`.
- API контракты стабильны для frontend режимов `filled/template` и PDF.
- Error/limit/health/observability закрыты для staging.
- Frontend переключен на backend через адаптерный слой без нарушения FSD-границ.
