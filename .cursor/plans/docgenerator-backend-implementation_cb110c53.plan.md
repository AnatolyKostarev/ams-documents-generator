---
name: docgenerator-backend-implementation
overview: План реализации backend DocGenerator MVP в монорепозитории (pnpm workspaces + turbo) с единым контрактом данных, Prisma/seed, API generate/pdf, rate limit и интеграцией с apps/web.
todos:
  - id: be-mono-bootstrap
    content: Инициализировать монорепозиторий и общий pipeline (pnpm workspaces + turbo)
    status: pending
  - id: be-api-foundation
    content: Поднять apps/api и базовые server conventions
    status: pending
  - id: be-infra
    content: Настроить Prisma/PostgreSQL, env validation и db singleton в apps/api
    status: pending
  - id: be-schema-seed
    content: Реализовать schema + seed с parentId/self-relation и синхронизацией с packages/shared
    status: pending
  - id: be-template-generate
    content: Сделать templates service и внедрить /api/generate для filled/template режимов
    status: pending
  - id: be-pdf-api
    content: Внедрить /api/pdf, сессии и единый disclaimer в pdf-template
    status: pending
  - id: be-security
    content: Добавить rate limit, sanitize, healthcheck, error handling, logging/sentry
    status: pending
  - id: be-integration
    content: Подключить apps/web к apps/api через shared-контракт и пройти turbo + E2E проверки
    status: pending
isProject: false
---

# Backend Implementation Plan — DocGenerator MVP (Monorepo)

## Цель
Поднять backend-контур в `apps/api` (Next.js API Routes + PostgreSQL/Prisma), чтобы обеспечить генерацию документа, PDF, rate limiting и хранение шаблонов в модели, полностью совместимой с frontend из `apps/web`.

## Монорепо-структура (целевая)
- `apps/web` — frontend
- `apps/api` — backend
- `packages/shared` — общие типы/схемы/константы
- `packages/config` — общие eslint/tsconfig/prettier настройки

## Контракт и точки связи с frontend
Основной контракт должен быть общим для backend/frontend:
- [packages/shared](packages/shared)

Backend-слой и интеграционные точки:
- `apps/api/src/app/api/generate/route.ts`
- `apps/api/src/app/api/pdf/route.ts`
- `apps/api/src/shared/lib/server/templates.ts`
- `apps/api/src/shared/lib/server/ai.ts`
- `apps/api/src/shared/lib/server/pdf.ts`
- `apps/api/prisma/schema.prisma`

## Последовательность внедрения

### 1) Bootstrap монорепозитория
- Настроить `pnpm-workspace.yaml`, root `package.json`, `turbo.json`.
- Подключить pipeline задач (`dev`, `lint`, `typecheck`, `build`) для `apps/*` и `packages/*`.
- Создать `packages/config` и `packages/shared` (каркас контракта).

### 2) Подъем `apps/api` и инфраструктура окружения
- Подключить Prisma + PostgreSQL, описать env (`DATABASE_URL`, `ANTHROPIC_API_KEY`, URL’ы).
- Добавить `apps/api/src/shared/lib/server/env.ts` с Zod-валидацией.
- Создать `apps/api/src/shared/lib/server/db.ts` (Prisma singleton).
- Подключить shared-конфиг из `packages/config`.

### 3) Модель Prisma (единая с фронтом)
- Создать `Category` и `Document` с полями SEO/контента и `parentId` self-relation в `apps/api/prisma/schema.prisma`.
- Учитывать `published`, `priority`, `updatedAt` как обязательные поля для sitemap/витрины.
- Применить миграции и проверить schema drift.

### 4) Seed и иерархия документов
- Реализовать `apps/api/prisma/seed.ts` с порядком: сначала категории, затем hub-документы (`parentId: null`), затем variations (`parentId != null`).
- Держать seed-данные синхронно с shared-контрактом и фронтовыми mock JSON до полного переключения источника.

### 5) Сервис шаблонов и контентные запросы + `/api/generate`
- Реализовать `templates.ts`: `getDocument`, `getVariation`, `getAllDocuments`, `getCategoryHubs`.
- Возвращать категории/parent/children через include, чтобы frontend не делал дополнительные запросы.
- `POST /api/generate` с Zod-валидацией входа.
- `mode=filled`: sanitize + вызов Anthropic (`claude-haiku-4-5-20251001`).
- `mode=template`: серверная замена placeholders на подчеркивания без вызова AI.
- Возвращать `{ success, documentText, sessionId }` в едином формате.

### 6) API PDF и единый дисклеймер
- `POST /api/pdf`: брать текст по `sessionId`, рендерить PDF через Puppeteer.
- Единый дисклеймер хранить в `packages/shared` (или в shared constants с единым импортом) и использовать в HTML-шаблоне PDF.
- Фоллбек на dev-заглушку для локальной быстрой проверки.

### 7) Защита и эксплуатация
- Внедрить rate limiting (11-й запрос -> 429), сначала in-memory fallback, затем Upstash Redis.
- Добавить `/api/health`, базовые structured logs, интеграцию Sentry.
- Настроить устойчивые ошибки (400/404/429/500) без утечки внутренних деталей.

### 8) Подключение frontend к backend (переход без рефакторинга UI)
- Перевести frontend repository с mock на HTTP-реализацию к `apps/api`.
- Оставить FSD-границы: backend изменения не должны протекать в widgets/pages напрямую.
- Проверить, что sitemap/robots/metadata используют backend-данные (`updatedAt`, `published`).
- Прогнать `pnpm turbo run lint typecheck build` и smoke E2E для ключевых сценариев.

## Definition of Done (backend)
- Prisma schema и seed полностью поддерживают 3-уровневую иерархию.
- `/api/generate` и `/api/pdf` выдают стабильный контракт для frontend.
- `template`-режим работает без Anthropic вызова.
- Rate limiting и базовая безопасность работают на staging.
- Контракт данных не дублируется: используется `packages/shared`.
- Frontend переключается с mock на backend через слой repository/adapter, без переразметки страниц.
