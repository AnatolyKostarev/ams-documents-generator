---
name: docgenerator-backend-implementation
overview: Пошаговый план backend-части DocGenerator MVP с единым контрактом данных, Prisma/seed, API generate/pdf, rate limit и безопасной интеграцией с frontend.
todos:
  - id: be-infra
    content: Настроить Prisma/PostgreSQL, env validation и db singleton
    status: pending
  - id: be-schema-seed
    content: Реализовать schema + seed с parentId/self-relation и 7 категориями
    status: pending
  - id: be-template-service
    content: Сделать templates service для hub/variation/all docs выборок
    status: pending
  - id: be-generate-api
    content: Внедрить /api/generate для filled/template режимов
    status: pending
  - id: be-pdf-api
    content: Внедрить /api/pdf и единый disclaimer в pdf-template
    status: pending
  - id: be-security
    content: Добавить rate limit, sanitize, healthcheck, error handling
    status: pending
  - id: be-integration
    content: Подключить frontend к backend через repository-адаптер и пройти E2E проверки
    status: pending
isProject: false
---

# Backend Implementation Plan — DocGenerator MVP

## Цель
Поднять backend-контур на Next.js API Routes + PostgreSQL/Prisma, чтобы обеспечить генерацию документа, PDF, rate limiting и хранение шаблонов в модели, полностью совместимой с frontend.

## Контракт и точки связи с frontend
Основной контракт должен быть общим для backend/frontend:
- [src/entities/document/model/types.ts](src/entities/document/model/types.ts)
- [src/shared/data/documents](src/shared/data/documents)

Backend-слой и интеграционные точки:
- `src/app/api/generate/route.ts`
- `src/app/api/pdf/route.ts`
- `src/shared/lib/server/templates.ts`
- `src/shared/lib/server/ai.ts`
- `src/shared/lib/server/pdf.ts`
- `prisma/schema.prisma`

## Последовательность внедрения

### 1) База и инфраструктура окружения
- Подключить Prisma + PostgreSQL, описать env (`DATABASE_URL`, `ANTHROPIC_API_KEY`, URL’ы).
- Добавить `src/shared/lib/server/env.ts` с Zod-валидацией.
- Создать `src/shared/lib/server/db.ts` (Prisma singleton).

### 2) Модель Prisma (единая с фронтом)
- Создать `Category` и `Document` с полями SEO/контента и `parentId` self-relation.
- Учитывать `published`, `priority`, `updatedAt` как обязательные поля для sitemap/витрины.
- Применить миграции и проверить schema drift.

### 3) Seed и иерархия документов
- Реализовать `prisma/seed.ts` с порядком: сначала категории, затем hub-документы (`parentId: null`), затем variations (`parentId != null`).
- Держать seed-данные синхронно с фронтовыми mock JSON до полного переключения источника.

### 4) Сервис шаблонов и контентные запросы
- Реализовать `templates.ts`: `getDocument`, `getVariation`, `getAllDocuments`, `getCategoryHubs`.
- Возвращать категории/parent/children через include, чтобы frontend не делал дополнительные запросы.

### 5) API генерации документа
- `POST /api/generate` с Zod-валидацией входа.
- `mode=filled`: sanitize + вызов Anthropic (`claude-haiku-4-5-20251001`).
- `mode=template`: серверная замена placeholders на подчеркивания без вызова AI.
- Возвращать `{ success, documentText, sessionId }` в едином формате.

### 6) API PDF и единый дисклеймер
- `POST /api/pdf`: брать текст по `sessionId`, рендерить PDF через Puppeteer.
- Единый дисклеймер хранить в `src/shared/config/constants.ts` и использовать в HTML-шаблоне PDF.
- Фоллбек на dev-заглушку для локальной быстрой проверки.

### 7) Защита и эксплуатация
- Внедрить rate limiting (11-й запрос -> 429), сначала in-memory fallback, затем Upstash Redis.
- Добавить `/api/health`, базовые structured logs, интеграцию Sentry.
- Настроить устойчивые ошибки (400/404/429/500) без утечки внутренних деталей.

### 8) Подключение frontend к backend (переход без рефакторинга UI)
- Перевести frontend repository с mock на HTTP-реализацию.
- Оставить FSD-границы: backend изменения не должны протекать в widgets/pages напрямую.
- Проверить, что sitemap/robots/metadata используют backend-данные (`updatedAt`, `published`).

## Definition of Done (backend)
- Prisma schema и seed полностью поддерживают 3-уровневую иерархию.
- `/api/generate` и `/api/pdf` выдают стабильный контракт для frontend.
- `template`-режим работает без Anthropic вызова.
- Rate limiting и базовая безопасность работают на staging.
- Frontend переключается с mock на backend через слой repository/adapter, без переразметки страниц.
