import type { Category } from '../types/category'
import type { DocumentData, DocumentJson } from '../types/document'

export function mapDocumentJson(
  raw: DocumentJson,
  categoriesBySlug: Map<string, Category>,
  documentsBySlug: Map<string, DocumentJson>
): DocumentData {
  const category = categoriesBySlug.get(raw.categorySlug)
  if (!category) {
    throw new Error(
      `Document "${raw.slug}": unknown categorySlug "${raw.categorySlug}"`
    )
  }

  let parentId: string | null = null
  if (raw.parentSlug !== null) {
    const parent = documentsBySlug.get(raw.parentSlug)
    if (!parent) {
      throw new Error(
        `Document "${raw.slug}": parentSlug "${raw.parentSlug}" not found`
      )
    }
    if (parent.categorySlug !== raw.categorySlug) {
      throw new Error(
        `Document "${raw.slug}": cross-category parent "${raw.parentSlug}"`
      )
    }
    parentId = raw.parentSlug
  }

  return {
    id: raw.slug,
    slug: raw.slug,
    categoryId: category.id,
    categorySlug: category.slug,
    category: {
      id: category.id,
      slug: category.slug,
      name: category.name,
    },
    parentId,
    parentSlug: raw.parentSlug,
    titleH1: raw.titleH1,
    titleGen: raw.titleGen,
    metaTitle: raw.metaTitle,
    metaDesc: raw.metaDesc,
    leadShort: raw.leadShort,
    leadFull: raw.leadFull,
    legalBasis: raw.legalBasis,
    templateBody: raw.templateBody,
    contentBody: raw.contentBody,
    formFields: raw.formFields,
    faq: raw.faq,
    relatedIds: raw.relatedIds,
    published: raw.published,
    priority: raw.priority,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

export function mapDocuments(
  raws: DocumentJson[],
  categories: Category[]
): DocumentData[] {
  const categoriesBySlug = new Map(categories.map((c) => [c.slug, c]))
  const documentsBySlug = new Map(raws.map((d) => [d.slug, d]))
  return raws.map((raw) =>
    mapDocumentJson(raw, categoriesBySlug, documentsBySlug)
  )
}
