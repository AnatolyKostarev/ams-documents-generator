---
name: docgenerator-frontend-step-by-step-estimate
overview: Детализированный пошаговый план реализации frontend DocGenerator MVP с оценкой по часам, зависимостями этапов и контрольными точками качества в FSD-архитектуре.
todos:
  - id: step0-setup
    content: Подготовить каркас проекта и FSD-ограничения (4–5ч)
    status: pending
  - id: step1-domain-data
    content: Внедрить единую модель данных и mock repository слой (8–10ч)
    status: pending
  - id: step2-routing
    content: Собрать App Router маршруты и page orchestration (11–13ч)
    status: pending
  - id: step3-document-widgets
    content: Реализовать document widgets и мобильный UX поток (14–16ч)
    status: pending
  - id: step4-features-flow
    content: Внедрить generate/download flow и preview (12–14ч)
    status: pending
  - id: step5-seo-schema
    content: Закрыть metadata, schema, robots, sitemap (8–9ч)
    status: pending
  - id: step6-api-bridge
    content: Подготовить API-контуры и адаптер к backend (5–6ч)
    status: pending
  - id: step7-qa
    content: Финальный QA, аналитика и стабилизация (4–5ч)
    status: pending
isProject: false
---

# Пошаговый план реализации Frontend (с оценкой) — DocGenerator MVP

## Контекст
Основан на текущем плане: [docgenerator-frontend-implementation_55da44f8.plan.md](.cursor/plans/docgenerator-frontend-implementation_55da44f8.plan.md). Ниже — операционный план внедрения с приоритетами, зависимостями и временной оценкой для Middle-разработчика.

## Итоговая оценка
- Базовая оценка: **66–72 часа**
- Буфер на риски (20%): **13–14 часов**
- Итого: **79–86 часов** (примерно 10–11 рабочих дней)

## Последовательность внедрения

### Шаг 0. Подготовка среды и архитектурных ограничений (4–5ч)
- Зафиксировать структуру слоев FSD: `app/pages/widgets/features/entities/shared`.
- Настроить алиасы `@/*`, линт-ограничения на dependency direction.
- Подготовить базовые shared-модули: constants, базовые UI-примитивы, утилиты.

Результат:
- Каркас проекта готов, архитектурные правила не дают «ломать» FSD.

Зависимости:
- Нет.

---

### Шаг 1. Доменная модель и слой данных (8–10ч)
- Описать типы `Category`, `FormField`, `FaqItem`, `DocumentData` в `entities`.
- Добавить mock-repositories для `document/category`.
- Подготовить JSON-данные (7 категорий + документы) с полной схемой полей.
- Ввести адаптерный интерфейс репозитория (чтобы затем заменить mock на HTTP без переделки UI).

Результат:
- Стабильный контракт данных для всех следующих этапов.

Зависимости:
- Требует завершения шага 0.

---

### Шаг 2. Маршруты App Router + page orchestration (11–13ч)
- Реализовать маршруты: `/`, `/[category]`, `/[category]/[document]`, `/[category]/[document]/[variation]`, `/ai-generator`, `not-found`.
- Вынести page-композицию в `pages/*`, route-файлы оставить тонкими.
- Реализовать `generateStaticParams` и обработку notFound для невалидных комбинаций.

Результат:
- Рабочий трехуровневый роутинг с чистой FSD-композицией.

Зависимости:
- Требует шага 1.

---

### Шаг 3. Документная страница: widgets и UX-критичные блоки (14–16ч)
- Реализовать `widgets/document-page/*` в обязательном порядке блоков: Breadcrumbs -> H1 -> Lead -> TrustBadge -> Widget -> Content -> FAQ -> Related -> CTA -> Disclaimer.
- Реализовать адаптивный `LeadParagraph` (mobile-short/desktop-full).
- Сделать `RelatedDocs` с горизонтальным скроллом и исключением текущего документа.
- Проверить, что widget виден до первого скролла на 375px.

Результат:
- Основной SEO/UX-поток документа полностью готов.

Зависимости:
- Требует шага 2.

---

### Шаг 4. Feature-слои генерации/скачивания + предпросмотр (12–14ч)
- `features/document-generate`: режимы `filled/template`, state-machine шагов, сабмит.
- `features/document-download`: DownloadModal, действия «скачать app / только PDF».
- `entities/document/ui/DocumentPreview`: blur, copy full-text, toast и метрика.
- Приватность и UX-тексты в финальной формулировке.

Результат:
- Завершенный пользовательский сценарий «ввод -> генерация -> предпросмотр -> скачивание».

Зависимости:
- Требует шага 3.

---

### Шаг 5. SEO и schema-инфраструктура (8–9ч)
- `generateMetadata` для category/doc/variation (`{year}` + canonical).
- JSON-LD builders: `FAQPage`, `BreadcrumbList`, `HowTo`, `WebSite/SearchAction`, `SoftwareApplication`, `ItemList`.
- `robots.ts` и `sitemap.ts` (`lastmod` из `updatedAt`).

Результат:
- Полная SEO-готовность для индексации и rich snippets.

Зависимости:
- Требует шагов 2–4.

---

### Шаг 6. API-контуры и backend-готовность фронтенда (5–6ч)
- Mock API handlers: `/api/generate`, `/api/pdf` с финальным контрактом.
- Подключение UI только через API handlers.
- Подготовка `http-repository` и флага переключения источника данных.

Результат:
- Безболезненный переход на реальный backend без рефакторинга UI-слоев.

Зависимости:
- Требует шагов 1 и 4.

---

### Шаг 7. Аналитика, стабилизация, финальный QA (4–5ч)
- Внедрить 10 событий аналитики.
- Проверить JS-disabled, Lighthouse/LCP, Rich Results.
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
- Итерация 4 (Дни 7–8): Шаги 4–5
- Итерация 5 (Дни 9–10): Шаги 6–7 + буфер

## Риски и резерв времени
- Mobile UX и iOS-поведение модалок/инпутов: +3ч
- Доработки schema.org после валидации: +2ч
- Корректность sitemap/canonical на вариациях: +2ч
- Итого резерв уже учтен в 20% буфере.

## Критерии завершения
- Маршруты и контент 3 уровней стабильны.
- FSD-границы соблюдены (без утечек бизнес-логики в `app`).
- SEO/Schema/robots/sitemap валидны.
- UX и аналитика проходят чеклист MVP.
- Замена mock на backend выполняется через адаптеры, без изменения widgets/pages.
