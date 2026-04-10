# AMS Documents Generator

Стартовый каркас проекта для DocGenerator MVP на `Next.js 14 + TypeScript`.

## Быстрый старт

```bash
npm install
npm run dev
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000).

## AI rules и skills

- Политика коммитов: `.cursor/rules/commit-and-push-policy.mdc`
- Матрица соответствия правил и навыков: `.cursor/rules-skills-matrix.md`
- Project skills: `.cursor/skills/`

## Что уже подготовлено

- трехуровневый роутинг:
  - `/<category>/`
  - `/<category>/<document>/`
  - `/<category>/<document>/<variation>/`
- страница `ai-generator`
- кастомная `404` (`src/app/not-found.tsx`)
- `robots` и `sitemap` (`src/app/robots.ts`, `src/app/sitemap.ts`)
- API-заглушки:
  - `POST /api/generate`
  - `POST /api/pdf`
- базовая типизация модели данных: `src/types/index.ts`
- категории (7 штук): `src/data/categories.json`
- единый дисклеймер: `src/lib/constants.ts`

## Структура

```txt
src/
  app/
    page.tsx
    [category]/page.tsx
    [category]/[document]/page.tsx
    [category]/[document]/[variation]/page.tsx
    ai-generator/page.tsx
    not-found.tsx
    api/generate/route.ts
    api/pdf/route.ts
    robots.ts
    sitemap.ts
  lib/
    constants.ts
    mock.ts
  types/
    index.ts
  data/
    categories.json
```

## Следующие шаги

1. Добавить реальные JSON-документы в `src/data/documents`.
2. Реализовать компоненты из плана (`DocumentWidget`, `TrustBadge`, `RelatedDocs` и др.).
3. Переключить мок-слой `src/lib/mock.ts` на реальную БД/Prisma.
4. Подключить аналитику и JSON-LD схемы.
