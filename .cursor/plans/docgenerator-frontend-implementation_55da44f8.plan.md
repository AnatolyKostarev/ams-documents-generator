---
name: docgenerator-frontend-implementation
overview: План реализации frontend DocGenerator MVP в монорепозитории (pnpm workspaces + turbo) с FSD-структурой, SEO, роутингом и готовностью к интеграции с apps/api.
todos:
  - id: fe-mono-bootstrap
    content: Инициализировать монорепозиторий и pipeline (pnpm workspaces + turbo)
    status: pending
  - id: fe-web-fsd
    content: Развернуть apps/web и зафиксировать FSD-границы
    status: pending
  - id: fe-shared-contract
    content: Вынести единый контракт данных в packages/shared и подключить mock repositories
    status: pending
  - id: fe-routing-pages
    content: Реализовать страницы и трехуровневый роутинг в apps/web через App Router + pages composition
    status: pending
  - id: fe-core-widgets
    content: Собрать ключевые widgets/features (widget, preview, modal, trust, related, lead) в apps/web
    status: pending
  - id: fe-seo
    content: Настроить metadata, schema.org, robots, sitemap и quality-gates через turbo
    status: pending
  - id: fe-api-bridge
    content: Подготовить API bridge и адаптер переключения mock/http для apps/api
    status: pending
  - id: fe-qa
    content: Провести UX/SEO/perf проверки и закрыть DoD в monorepo pipeline
    status: pending
isProject: false
---

# Frontend Implementation Plan — DocGenerator MVP (Monorepo)

## Цель
Собрать production-ready frontend в `apps/web` (Next.js App Router) с трехуровневым роутингом, корректным SEO/Schema и FSD-архитектурой в рамках монорепозитория, чтобы backend из `apps/api` подключался без переразметки UI.

## Монорепо-структура (целевая)
- `apps/web` — frontend (App Router + FSD)
- `apps/api` — backend API
- `packages/shared` — общие типы/схемы/константы
- `packages/config` — общие eslint/tsconfig/prettier настройки

## Базовая FSD-структура (обязательная)
- `app` — только маршруты, layout, metadata, `robots`, `sitemap`, глобальные providers.
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

### 1) Bootstrap монорепозитория
- Настроить `pnpm-workspace.yaml`, root `package.json`, `turbo.json`.
- Подключить root scripts: `dev`, `build`, `lint`, `typecheck`, `test`.
- Создать `packages/config` с едиными правилами eslint/tsconfig/prettier.
- Подготовить `packages/shared` (каркас экспорта контрактов).

### 2) Подъем `apps/web` и FSD-каркаса
- Развернуть Next.js в `apps/web`.
- Создать структуру `apps/web/src/app|pages|widgets|features|entities|shared`.
- Настроить alias `@/*` и запрет cross-layer импортов.
- Подключить shared-конфиг из `packages/config`.

### 3) Единый контракт и мок-данные
- Описать `Category`, `FormField`, `FaqItem`, `DocumentData` в `packages/shared`.
- Сделать `apps/web/src/entities/document/api/mock-repository.ts` и `apps/web/src/entities/category/api/mock-repository.ts`.
- Разместить JSON-данные в `apps/web/src/shared/data/categories.json` и `apps/web/src/shared/data/documents/*.json`.
- Сразу заложить поля `parentId`, `titleGen`, `metaTitle`, `metaDesc`, `legalBasis`, `contentBody`, `updatedAt`.
- Экспортировать адаптерный интерфейс: `mock-repository -> http-repository`.

### 4) Роутинг и страницы (App Router + FSD composition)
- Реализовать `apps/web/src/app/page.tsx`, `apps/web/src/app/[category]/page.tsx`, `apps/web/src/app/[category]/[document]/page.tsx`, `apps/web/src/app/[category]/[document]/[variation]/page.tsx`, `apps/web/src/app/ai-generator/page.tsx`, `apps/web/src/app/not-found.tsx`.
- Логику страницы держать в `apps/web/src/pages/*`, route-file оставлять тонким.
- Для document/variation применить блоки в обязательном порядке из skill `docgenerator-document-page`.

### 5) Ключевые UI-блоки и фичи
- `apps/web/src/widgets/document-page/*`: Breadcrumbs, LeadParagraph, TrustBadge, RelatedDocs, FAQ, CTA, Disclaimer.
- `apps/web/src/features/document-generate/*`: режимы `filled|template`, submit flow, loading/error states.
- `apps/web/src/features/document-download/*`: открытие модалки, скачивание PDF/приложения.
- `apps/web/src/entities/document/ui/DocumentPreview` с blur и copy.

### 6) SEO и техническая индексация
- `apps/web/src/app/sitemap.ts` — lastmod из `updatedAt` документов.
- `apps/web/src/app/robots.ts` — disallow для `/api/`, `/admin/`, `/cabinet/`, query-паттернов.
- `apps/web/src/shared/lib/schema/*` — builders для `FAQPage`, `BreadcrumbList`, `HowTo`, `WebSite/SearchAction`, `SoftwareApplication`, `ItemList`.
- `generateMetadata` на category/doc/variation с `{year}` replacement и canonical.
- Подключить quality-gates в turbo: `pnpm turbo run lint typecheck build --filter=web...`.

### 7) Интеграционные API-контуры
- В `apps/web` оставить временные handlers в mock-режиме только для локальной разработки (при необходимости).
- Основной frontend flow строить через репозиторий и HTTP-клиент к `apps/api`.
- Подготовить переключение источника данных через env/feature flag: `mock-repository -> http-repository`.
- Использовать только shared-контракт из `packages/shared`.

### 8) Аналитика, UX-стабильность и quality-gate
- Реализовать 10 событий метрики через `apps/web/src/shared/lib/analytics`.
- Проверить mobile UX: widget above first scroll, iOS input >=16px, RelatedDocs horizontal scroll.
- Проверить JS-disabled rendering, Lighthouse/LCP, Rich Results validation.
- Прогнать full pipeline: `pnpm turbo run lint typecheck build`.

## Definition of Done (frontend)
- Все маршруты 3-уровневой структуры работают и отдают корректный metadata/canonical.
- Все document pages содержат `BreadcrumbList + FAQPage + HowTo`.
- `sitemap.xml` и `robots.txt` соответствуют требованиям MVP.
- Все ключевые компоненты распределены по FSD-слоям без архитектурных нарушений.
- Контракт данных не дублируется: используется `packages/shared`.
- Переключение на реальный backend возможно через замену repository-адаптеров без переписывания UI.
