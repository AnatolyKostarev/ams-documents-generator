---
name: docgenerator-frontend-step-by-step-estimate
overview: Детализированный пошаговый план реализации frontend DocGenerator MVP в монорепозитории (pnpm workspaces + turbo) с оценкой по часам, зависимостями и FSD-ограничениями.
todos:
  - id: fe-mono-step0
    content: Инициализировать монорепо (pnpm workspaces + turbo) и общие пакеты (6–8ч)
    status: pending
  - id: fe-mono-step1
    content: Поднять apps/web и зафиксировать FSD-границы в приложении (6–7ч)
    status: pending
  - id: fe-mono-step2
    content: Реализовать единый контракт данных в packages/shared и mock-репозитории (9–11ч)
    status: pending
  - id: fe-mono-step3
    content: Собрать маршруты App Router и page orchestration для 3 уровней URL (11–13ч)
    status: pending
  - id: fe-mono-step4
    content: Реализовать document widgets и feature-флоу generate/download/preview (16–18ч)
    status: pending
  - id: fe-mono-step5
    content: Настроить SEO/schema/robots/sitemap и turbo-задачи quality-gates (10–12ч)
    status: pending
  - id: fe-mono-step6
    content: Подготовить API bridge к apps/api и переключение mock/http-источника (6–7ч)
    status: pending
  - id: fe-mono-step7
    content: Финальный QA, аналитика и стабилизация в монорепо pipeline (6–7ч)
    status: pending
isProject: false
---

# Пошаговый план реализации Frontend (с оценкой) — DocGenerator MVP (Monorepo)

## Контекст
Основан на текущем плане: [docgenerator-frontend-implementation_55da44f8.plan.md](.cursor/plans/docgenerator-frontend-implementation_55da44f8.plan.md). План обновлен под `pnpm workspaces + turbo` и предполагает структуру:
- `apps/web` — Next.js App Router frontend
- `apps/api` — backend API
- `packages/shared` — общие типы/схемы/константы
- `packages/config` — общие eslint/tsconfig/prettier настройки

## Итоговая оценка
- Базовая оценка: **70–83 часа**
- Буфер на риски (20%): **14–17 часов**
- Итого: **84–100 часов** (примерно 11–13 рабочих дней)

## Последовательность внедрения

### Шаг 0. Bootstrap монорепозитория (6–8ч)
- Настроить `pnpm-workspace.yaml`, корневой `package.json` и `turbo.json`.
- Подключить общие команды: `lint`, `typecheck`, `build`, `dev`, `test` через turbo pipeline.
- Создать `packages/config` (eslint/tsconfig/prettier presets).
- Подготовить `packages/shared` как источник единого контракта (пока каркас).

Результат:
- Рабочий monorepo pipeline, единая точка запуска и кэшируемые задачи.

Зависимости:
- Нет.

---

### Шаг 1. Подъем `apps/web` и FSD-ограничений (6–7ч)
- Развернуть `apps/web` на Next.js App Router.
- Зафиксировать FSD-структуру в `apps/web/src`: `app/pages/widgets/features/entities/shared`.
- Настроить алиасы (`@/*`) и архитектурные ограничения импортов.
- Подключить shared config из `packages/config`.

Результат:
- Frontend-приложение развернуто в monorepo без нарушения FSD-направления зависимостей.

Зависимости:
- Требует завершения шага 0.

---

### Шаг 2. Контракт данных и mock-источник в monorepo (9–11ч)
- Описать `Category`, `FormField`, `FaqItem`, `DocumentData` в `packages/shared`.
- Экспортировать shared-типы через публичный API пакета.
- Подготовить mock-репозитории в `apps/web/src/entities/*/api`.
- Подготовить JSON-данные (7 категорий + документы) с полной схемой полей.
- Ввести репозиторный интерфейс для переключения `mock -> http`.

Результат:
- Единый контракт данных для frontend/backend с типобезопасным импортом из shared-пакета.

Зависимости:
- Требует шага 1.

---

### Шаг 3. Маршруты App Router + page orchestration (11–13ч)
- Реализовать маршруты: `/`, `/[category]`, `/[category]/[document]`, `/[category]/[document]/[variation]`, `/ai-generator`, `not-found`.
- Вынести page-композицию в `pages/*`, route-файлы оставить тонкими.
- Реализовать `generateStaticParams` и обработку notFound для невалидных комбинаций.

Результат:
- Рабочий трехуровневый роутинг с чистой FSD-композицией.

Зависимости:
- Требует шага 2.

---

### Шаг 4. Документная страница и feature-flow (16–18ч)
- Реализовать `widgets/document-page/*` в обязательном порядке блоков: Breadcrumbs -> H1 -> Lead -> TrustBadge -> Widget -> Content -> FAQ -> Related -> CTA -> Disclaimer.
- Реализовать адаптивный `LeadParagraph` (mobile-short/desktop-full).
- Сделать `RelatedDocs` с горизонтальным скроллом и исключением текущего документа.
- Реализовать `features/document-generate` (`filled/template`, state-machine, loading/error).
- Реализовать `features/document-download` (modal, app/pdf actions).
- Реализовать `entities/document/ui/DocumentPreview` (blur, copy, toast).
- Проверить, что widget виден до первого скролла на 375px.

Результат:
- Основной продуктовый сценарий документа готов end-to-end на frontend.

Зависимости:
- Требует шага 3.

---

### Шаг 5. SEO/schema + turbo quality gates (10–12ч)
- `generateMetadata` для category/doc/variation (`{year}` + canonical).
- JSON-LD builders: `FAQPage`, `BreadcrumbList`, `HowTo`, `WebSite/SearchAction`, `SoftwareApplication`, `ItemList`.
- `robots.ts` и `sitemap.ts` (`lastmod` из `updatedAt`).
- Подключить turbo-задачи для `apps/web`: `lint`, `typecheck`, `build` как обязательный quality-gate.

Результат:
- Полная SEO-готовность для индексации и rich snippets.

Зависимости:
- Требует шагов 3–4.

---

### Шаг 6. API bridge к `apps/api` и переключение источника (6–7ч)
- Mock API handlers: `/api/generate`, `/api/pdf` с финальным контрактом.
- Подключение UI только через API handlers.
- Подготовка `http-repository` и флага/переменной окружения переключения источника данных.
- Сверка shared-контракта с backend через `packages/shared`.

Результат:
- Безболезненный переход на реальный backend без рефакторинга UI-слоев.

Зависимости:
- Требует шагов 2 и 4.

---

### Шаг 7. Аналитика, стабилизация, финальный QA в монорепо (6–7ч)
- Внедрить 10 событий аналитики.
- Проверить JS-disabled, Lighthouse/LCP, Rich Results.
- Прогнать `pnpm turbo run lint typecheck build` и исправить блокирующие ошибки в affected-пакетах.
- Финальный прогон MVP-чеклиста и устранение мелких дефектов.

Результат:
- Release-ready frontend с закрытым DoD.

Зависимости:
- Требует завершения шагов 5–6.

## Критический путь внедрения
`Шаг 0 -> Шаг 1 -> Шаг 2 -> Шаг 3 -> Шаг 4 -> Шаг 5 -> Шаг 6 -> Шаг 7`

## Распределение по итерациям
- Итерация 1 (Дни 1–2): Шаги 0–1
- Итерация 2 (Дни 3–4): Шаг 2
- Итерация 3 (Дни 5–6): Шаг 3
- Итерация 4 (Дни 7–8): Шаг 4
- Итерация 5 (Дни 9–10): Шаги 5–6
- Итерация 6 (Дни 11–12): Шаг 7 + буфер

## Риски и резерв времени
- Bootstrap monorepo (workspace links, turbo cache, pipeline drift): +3ч
- Mobile UX и iOS-поведение модалок/инпутов: +3ч
- Доработки schema.org после валидации: +2ч
- Корректность sitemap/canonical на вариациях: +2ч
- Итого резерв уже учтен в 20% буфере.

## Критерии завершения
- Маршруты и контент 3 уровней стабильны.
- FSD-границы соблюдены (без утечек бизнес-логики в `app`).
- Shared-контракт импортируется из `packages/shared`, а не дублируется в `apps/web`.
- SEO/Schema/robots/sitemap валидны.
- UX и аналитика проходят чеклист MVP.
- Замена mock на backend выполняется через адаптеры, без изменения widgets/pages.
