import type { Category } from '../types/category'
import type { DocumentJson } from '../types/document'

export type SeedValidationIssue = {
  code: string
  message: string
}

export function validateSeedData(
  categories: Category[],
  documents: DocumentJson[]
): SeedValidationIssue[] {
  const issues: SeedValidationIssue[] = []
  const categorySlugs = new Set(categories.map((c) => c.slug))
  const documentSlugs = new Set(documents.map((d) => d.slug))

  if (documentSlugs.size !== documents.length) {
    issues.push({
      code: 'DUPLICATE_SLUG',
      message: 'Document slugs must be unique',
    })
  }

  for (const doc of documents) {
    if (!categorySlugs.has(doc.categorySlug)) {
      issues.push({
        code: 'UNKNOWN_CATEGORY',
        message: `Document "${doc.slug}": unknown category "${doc.categorySlug}"`,
      })
    }

    if (doc.parentSlug !== null) {
      const parent = documents.find((d) => d.slug === doc.parentSlug)
      if (!parent) {
        issues.push({
          code: 'UNKNOWN_PARENT',
          message: `Document "${doc.slug}": parent "${doc.parentSlug}" not found`,
        })
      } else if (parent.parentSlug !== null) {
        issues.push({
          code: 'NESTED_VARIATION',
          message: `Document "${doc.slug}": parent must be a hub`,
        })
      } else if (parent.categorySlug !== doc.categorySlug) {
        issues.push({
          code: 'CROSS_CATEGORY_PARENT',
          message: `Document "${doc.slug}": parent in another category`,
        })
      }
    }

    for (const relatedId of doc.relatedIds) {
      if (relatedId === doc.slug) continue
      if (!documentSlugs.has(relatedId)) {
        issues.push({
          code: 'UNKNOWN_RELATED',
          message: `Document "${doc.slug}": relatedId "${relatedId}" not found`,
        })
      }
    }
  }

  return issues
}
