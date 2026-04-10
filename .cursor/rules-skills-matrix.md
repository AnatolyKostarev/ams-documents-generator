# Rules ↔ Skills Matrix (DocGenerator MVP)

Карта соответствия правил и навыков для команды.

## 1) Routing / Architecture

- **Rule:** `architecture-routing.mdc`
- **Primary skill:** `docgenerator-document-page`
- **Secondary skills:** `docgenerator-data-seed`, `docgenerator-seo-audit`
- **Когда запускать:** при добавлении новых маршрутов, хабов, вариаций, `generateStaticParams`.
- **Критерий покрытия:** корректная иерархия `category -> hub -> variation`, валидные breadcrumbs, успешный build.

## 2) Data Contract

- **Rule:** `data-contract-documents.mdc`
- **Primary skill:** `docgenerator-data-seed`
- **Secondary skills:** `docgenerator-document-page`, `docgenerator-widget-flow`
- **Когда запускать:** при добавлении/редактировании JSON-документов, полей формы, связей `parentSlug/relatedIds`.
- **Критерий покрытия:** уникальные slug, валидные ссылки, `published` корректно влияет на routes/sitemap.

## 3) SEO / Schema

- **Rule:** `seo-schema-standards.mdc`
- **Primary skill:** `docgenerator-seo-audit`
- **Secondary skills:** `docgenerator-document-page`
- **Когда запускать:** перед релизом, после изменений metadata, robots, sitemap, JSON-LD.
- **Критерий покрытия:** schema на всех типах страниц, корректный `robots`, `sitemap` только для `published: true`.

## 4) Widget / API Flow

- **Rule impact:** `data-contract-documents.mdc` + `seo-schema-standards.mdc` (косвенно)
- **Primary skill:** `docgenerator-widget-flow`
- **Когда запускать:** при изменениях `DocumentWidget`, `/api/generate`, `/api/pdf`, UX-состояний.
- **Критерий покрытия:** режимы `filled/template` работают стабильно, состояния и ошибки покрыты, analytics события присутствуют.

## Recommended execution order per task

1. **Data first:** `docgenerator-data-seed`
2. **Page integration:** `docgenerator-document-page`
3. **Flow behavior:** `docgenerator-widget-flow`
4. **Release gate:** `docgenerator-seo-audit`

## Quick release gate

- `npm run lint`
- `npm run build`
- Проверка hub + variation маршрутов
- Проверка `robots.txt` и `sitemap.xml`
