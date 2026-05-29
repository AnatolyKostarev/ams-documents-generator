import {
  categorySchema,
  documentJsonSchema,
  mapDocuments,
  validateSeedData,
  type Category,
  type DocumentData,
} from '@docgenerator/shared'

import categoriesJson from '@/shared/data/categories.json'
import { documentJsonFiles } from '@/shared/data/documents'

let cached: { categories: Category[]; documents: DocumentData[] } | null =
  null

function parseSeed() {
  const categories = categorySchema.array().parse(categoriesJson)
  const documentRaws = documentJsonFiles.map((raw) =>
    documentJsonSchema.parse(raw)
  )

  const issues = validateSeedData(categories, documentRaws)
  if (issues.length > 0) {
    const detail = issues.map((i) => i.message).join('; ')
    throw new Error(`Invalid seed data: ${detail}`)
  }

  const documents = mapDocuments(documentRaws, categories)
  return { categories, documents }
}

export function getSeedData(): {
  categories: Category[]
  documents: DocumentData[]
} {
  if (!cached) {
    cached = parseSeed()
  }
  return cached
}
