---
name: docgenerator-backend-step-by-step-estimate
overview: Детализированный пошаговый план backend-реализации DocGenerator MVP с оценкой трудозатрат, зависимостями этапов и порядком интеграции с frontend.
todos:
  - id: be-step0-baseline
    content: Подготовить server-структуру и единые backend conventions (3–4ч)
    status: pending
  - id: be-step1-infra
    content: Настроить Prisma/PostgreSQL, env validation, db singleton (6–7ч)
    status: pending
  - id: be-step2-schema
    content: Реализовать Prisma schema + миграции для Category/Document/self-relation (8–9ч)
    status: pending
  - id: be-step3-seed
    content: "Собрать seed-слой: категории, хабы, спицы и проверка консистентности (7–8ч)"
    status: pending
  - id: be-step4-templates
    content: Реализовать templates service для выборок hub/variation/all (5–6ч)
    status: pending
  - id: be-step5-generate
    content: Внедрить /api/generate с filled/template flow и session storage (9–10ч)
    status: pending
  - id: be-step6-pdf
    content: Внедрить /api/pdf, html-template и единый disclaimer (7–8ч)
    status: pending
  - id: be-step7-security
    content: Добавить rate limiting, healthcheck, error map, logging/sentry (6–7ч)
    status: pending
  - id: be-step8-integration
    content: Интегрировать frontend по HTTP repository и провести E2E smoke (5–6ч)
    status: pending
isProject: false
---

# Пошаговый план реализации Backend (с оценкой) — DocGenerator MVP

## Контекст
Основан на текущем плане: [docgenerator-backend-implementation_cb110c53.plan.md](.cursor/plans/docgenerator-backend-implementation_cb110c53.plan.md). Ниже — практический execution-план с временной оценкой и критическим путем.

## Итоговая оценка
- Базовая оценка: **50–56 часов**
- Буфер рисков (20%): **10–11 часов**
- Итого: **60–67 часов** (примерно 8 рабочих дней)

## Последовательность внедрения

### Шаг 0. Технический baseline и структура server-слоя (3–4ч)
- Подготовить server-модули в `src/shared/lib/server/*`.
- Зафиксировать единые server naming/conventions (env/db/templates/ai/pdf/session/rate-limit).
- Проверить контрактные типы между frontend и backend (`DocumentData`-поля).

Результат:
- Готова база для последовательного внедрения без хаотичного роста server-кода.

Зависимости:
- Нет.

---

### Шаг 1. Инфраструктура БД и окружений (6–7ч)
- Подключить Prisma + PostgreSQL.
- Реализовать `env.ts` (Zod-валидация обязательных переменных).
- Реализовать `db.ts` (Prisma singleton для serverless/dev).
- Добавить локальные команды запуска/миграции в документацию проекта.

Результат:
- Рабочее окружение backend и предсказуемая инициализация БД.

Зависимости:
- Требует шага 0.

---

### Шаг 2. Prisma schema и миграции (8–9ч)
- Описать модели `Category` и `Document` с полной SEO/контент-моделью.
- Добавить self-relation `parentId` для hub/variation и индексы по критичным полям (`slug`, `published`, `categoryId`).
- Выполнить миграцию и smoke-check схемы.

Результат:
- Стабильный контракт хранения данных для 3-уровневого роутинга и sitemap.

Зависимости:
- Требует шага 1.

---

### Шаг 3. Seed-слой и синхронизация с frontend данными (7–8ч)
- Реализовать `prisma/seed.ts` с правильным порядком (категории -> хабы -> спицы).
- Добавить 7 категорий и документы с полями расширенной модели.
- Проверить консистентность `parentId/parentSlug`, `published`, `updatedAt`.

Результат:
- База заполнена валидными данными, совместимыми с frontend-моками.

Зависимости:
- Требует шага 2.

---

### Шаг 4. Сервис шаблонов и контентных выборок (5–6ч)
- Реализовать `templates.ts`: `getDocument`, `getVariation`, `getAllDocuments`, `getCategoryHubs`.
- Встроить include для `category/parent/children`.
- Убедиться, что сервис покрывает нужды страниц, sitemap и API без повторения логики.

Результат:
- Единый data-access слой для всех backend use-cases.

Зависимости:
- Требует шага 3.

---

### Шаг 5. API `/api/generate` (filled/template) (9–10ч)
- Реализовать входную Zod-валидацию и sanitize полей.
- `filled`: вызов Anthropic модели `claude-haiku-4-5-20251001`.
- `template`: подстановка подчеркиваний без AI.
- Сохранять результат в session-store, возвращать единый контракт ответа.

Результат:
- Основной endpoint генерации закрывает оба режима UX фронтенда.

Зависимости:
- Требует шагов 1 и 4.

---

### Шаг 6. API `/api/pdf` и PDF-шаблонизация (7–8ч)
- Реализовать получение текста по `sessionId`.
- Собрать HTML-шаблон и генерацию PDF через Puppeteer.
- Подключить единый дисклеймер из `constants.ts`.
- Добавить dev-fallback (stub) на случай локальных ограничений Chromium.

Результат:
- Сквозной путь «сгенерировать -> скачать PDF» работает end-to-end.

Зависимости:
- Требует шага 5.

---

### Шаг 7. Безопасность, лимиты, устойчивость (6–7ч)
- Rate limiting (порог 10/мин, 11-й -> 429), сначала in-memory, затем Redis.
- Единая карта ошибок 400/404/429/500.
- `/api/health`, structured logging, интеграция Sentry.

Результат:
- Backend готов к staging-нагрузке и контролируемому мониторингу.

Зависимости:
- Требует шагов 5–6.

---

### Шаг 8. Интеграция с frontend и стабилизация контракта (5–6ч)
- Перевести frontend на HTTP-repository без изменений widgets/pages логики.
- Проверить, что sitemap/metadata/SEO-контуры читают актуальные backend-данные.
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
- Итерация 4 (Дни 4–5): Шаги 4–5
- Итерация 5 (День 6): Шаг 6
- Итерация 6 (День 7): Шаг 7
- Итерация 7 (День 8): Шаг 8 + буфер

## Основные риски и резерв
- Puppeteer в целевой среде (особенно serverless): +4ч
- Таймауты/ошибки Anthropic: +2–3ч
- Несовпадения seed и frontend-моков: +2ч
- Эти риски заложены в общий 20% буфер.

## Критерии завершения
- Prisma-модель и seed полностью поддерживают 3-уровневую иерархию.
- API контракты стабильны для frontend режимов `filled/template` и PDF.
- Error/limit/health/observability закрыты для staging.
- Frontend переключен на backend через адаптерный слой без нарушения FSD-границ.
