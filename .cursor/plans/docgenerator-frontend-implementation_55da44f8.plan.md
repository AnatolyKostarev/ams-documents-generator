---
name: docgenerator-frontend-implementation
overview: Пошаговый план реализации фронтенд-части DocGenerator MVP в `ams-documents-generator` с FSD-структурой, SEO, роутингом и готовностью к замене мок-данных на backend API.
todos:
  - id: fe-init-fsd
    content: Инициализировать Next.js проект и развернуть FSD-структуру в src/
    status: pending
  - id: fe-domain-model
    content: Внедрить единую модель DocumentData/Category и mock repositories
    status: pending
  - id: fe-routing-pages
    content: Реализовать страницы и трехуровневый роутинг через App Router + pages composition
    status: pending
  - id: fe-core-widgets
    content: "Собрать ключевые widgets/features: widget, preview, modal, trust, related, lead"
    status: pending
  - id: fe-seo
    content: Настроить metadata, schema.org, robots, sitemap
    status: pending
  - id: fe-api-bridge
    content: Подготовить API handlers и адаптер к будущему backend
    status: pending
  - id: fe-qa
    content: Провести UX/SEO/perf проверки и закрыть DoD
    status: pending
isProject: false
---

# Frontend Implementation Plan — DocGenerator MVP

## Цель
Собрать production-ready frontend на Next.js App Router с трехуровневым роутингом, корректным SEO/Schema, и FSD-архитектурой, чтобы backend можно было подключить заменой ограниченного числа точек интеграции.

## Базовая FSD-структура (обязательная)
- `app` — только маршруты, layout, metadata, `robots`, `sitemap`, API handlers, глобальные providers.
- `pages` — page-level композиция (при App Router: вынесенные page-composer компоненты).
- `widgets` — крупные блоки страниц (DocumentWidgetZone, RelatedDocsStrip, CategoryDocsList).
- `features` — пользовательские сценарии (генерация, копирование, переключение режимов, скачивание).
- `entities` — доменные модели (`document`, `category`), адаптеры данных, селекторы.
- `shared` — UI-kit, утилиты, schema builders, constants, analytics wrappers.

Ключевые файлы для старта:
- [README.md](README.md)
- [.cursor/skills/docgenerator-document-page/SKILL.md](.cursor/skills/docgenerator-document-page/SKILL.md)
- [.cursor/skills/docgenerator-widget-flow/SKILL.md](.cursor/skills/docgenerator-widget-flow/SKILL.md)
- [.cursor/skills/docgenerator-seo-audit/SKILL.md](.cursor/skills/docgenerator-seo-audit/SKILL.md)
- [.cursor/skills/docgenerator-data-seed/SKILL.md](.cursor/skills/docgenerator-data-seed/SKILL.md)

## Последовательность внедрения

### 1) Инициализация каркаса и FSD-слоев
- Создать Next.js 14+ проект в `src/` с TypeScript strict.
- Развернуть каталоги: `src/app`, `src/pages`, `src/widgets`, `src/features`, `src/entities`, `src/shared`.
- Настроить alias `@/*` и запрет cross-layer импортов (eslint rules/архитектурные соглашения).
- Вынести общий дисклеймер и константы в `src/shared/config/constants.ts`.

### 2) Единые типы и мок-источник данных
- Описать `Category`, `FormField`, `FaqItem`, `DocumentData` в `src/entities/document/model/types.ts` и `src/entities/category/model/types.ts`.
- Сделать `src/entities/document/api/mock-repository.ts` и `src/entities/category/api/mock-repository.ts`.
- Разместить JSON-данные в `src/shared/data/categories.json` и `src/shared/data/documents/*.json`.
- Сразу заложить поля `parentId`, `titleGen`, `metaTitle`, `metaDesc`, `legalBasis`, `contentBody`, `updatedAt`.

### 3) Роутинг и страницы (App Router + FSD composition)
- Реализовать `src/app/page.tsx`, `src/app/[category]/page.tsx`, `src/app/[category]/[document]/page.tsx`, `src/app/[category]/[document]/[variation]/page.tsx`, `src/app/ai-generator/page.tsx`, `src/app/not-found.tsx`.
- Логику страницы держать в `src/pages/*` (компоновка через widgets/features), route-file оставлять тонким.
- Для document/variation применить блоки в обязательном порядке из skill `docgenerator-document-page`.

### 4) Ключевые UI-блоки и фичи
- `widgets/document-page/*`: Breadcrumbs, LeadParagraph, TrustBadge, RelatedDocs, FAQ, CTA, Disclaimer.
- `features/document-generate/*`: режимы `filled|template`, submit flow, loading/error states.
- `features/document-download/*`: открытие модалки, скачивание PDF/приложения.
- `entities/document/ui/DocumentPreview` с blur и copy.

### 5) SEO и техническая индексация
- `src/app/sitemap.ts` — lastmod из `updatedAt` документов.
- `src/app/robots.ts` — disallow для `/api/`, `/admin/`, `/cabinet/`, query-паттернов.
- `src/shared/lib/schema/*` — builders для `FAQPage`, `BreadcrumbList`, `HowTo`, `WebSite/SearchAction`, `SoftwareApplication`, `ItemList`.
- `generateMetadata` на category/doc/variation с `{year}` replacement и canonical.

### 6) Интеграционные API-контуры (до реального backend)
- Оставить `src/app/api/generate/route.ts` и `src/app/api/pdf/route.ts` в mock-режиме, но с финальными контрактами.
- Подключить frontend flow только через API handlers (без прямой работы из виджета с моками).
- Подготовить адаптер переключения источника данных: `mock-repository` -> `http-repository`.

### 7) Аналитика, UX-стабильность и quality-gate
- Реализовать 10 событий метрики через `src/shared/lib/analytics`.
- Проверить mobile UX: widget above first scroll, iOS input >=16px, RelatedDocs horizontal scroll.
- Проверить JS-disabled rendering, Lighthouse/LCP, Rich Results validation.

## Definition of Done (frontend)
- Все маршруты 3-уровневой структуры работают и отдают корректный metadata/canonical.
- Все document pages содержат `BreadcrumbList + FAQPage + HowTo`.
- `sitemap.xml` и `robots.txt` соответствуют требованиям MVP.
- Все ключевые компоненты распределены по FSD-слоям без архитектурных нарушений.
- Переключение на реальный backend возможно через замену repository-адаптеров без переписывания UI.
