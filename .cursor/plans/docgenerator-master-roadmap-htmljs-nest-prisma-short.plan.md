---
name: docgenerator-master-roadmap-htmljs-nest-prisma-short
overview: "Краткая версия roadmap MVP: NestJS + Prisma backend, HTML + JS frontend с SEO-first подходом."
isProject: false
---

# Краткий roadmap DocGenerator (HTML+JS + NestJS + Prisma)

## Цель и стек
- Цель MVP: SEO-трафик из Яндекса -> генерация документа -> конверсия в PDF Commander.
- Backend: `Node.js + NestJS + Prisma` (`PostgreSQL` для staging/prod).
- Frontend: `HTML + JS` без SPA-роутера, только server-side отрисовка контента.

## Ключевые принципы реализации
- SEO-first: страницы должны быть полностью видны без JavaScript.
- URL-структура: `/`, `/:category/`, `/:category/:document/`, `/:category/:document/:variation/`, `/ai-generator/`.
- Контракт данных и API централизован в `packages/shared`.
- Обязательные SEO-артефакты: `canonical`, `schema.org`, `robots.txt`, `sitemap.xml`.

## Этапы (кратко)
- Этап 0: Foundation и ADR (архитектура, URL policy, env, rate-limit/session решения).
- Этап 1: NestJS skeleton + SSR HTML rendering + 404 + кеш/компрессия.
- Этап 2: Prisma schema + seed + SEO-поля контента.
- Этап 3: API `POST /api/generate` и `POST /api/pdf`, sanitize, rate-limit, тесты.
- Этап 4: HTML+JS UX-слой (виджет, preview, modal, FAQ, breadcrumbs).
- Этап 5: SEO и индексация (metadata, schema, robots/sitemap, no-JS проверка).
- Этап 6: Метрика, Sentry, perf, health/logging, privacy/cookie.
- Этап 7: Release gate, SEO acceptance, волновой запуск P0/P1.

## Таблица оценок по этапам
| Этап | Содержание | Оценка, ч |
| --- | --- | --- |
| 0 | Foundation и ADR | 12–16 |
| 1 | Backend skeleton + SSR infra | 16–22 |
| 2 | Prisma schema + seed + SEO data | 20–28 |
| 3 | API core (generate/pdf/security) | 28–36 |
| 4 | Frontend HTML+JS UX layer | 18–26 |
| 5 | SEO и индексация | 24–32 |
| 6 | Аналитика, perf, наблюдаемость | 14–20 |
| 7 | Release gate и запуск волнами | 10–14 |
| **Итого** | **Последовательная реализация** | **156–214** |

## Календарная оценка
- 1 разработчик: **4.5–6.5 недель**.
- 2 разработчика (параллельно после этапа 2): **3.5–5 недель**.
- Рекомендуемый буфер: **+15%**.
