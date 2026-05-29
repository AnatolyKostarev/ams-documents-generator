import { describe, expect, it } from 'vitest'

import { categorySchema, documentJsonSchema } from './schemas/document-json'
import { mapDocuments } from './lib/map-document'
import { validateSeedData } from './lib/validate-seed'
import type { Category } from './types/category'
import type { DocumentJson } from './types/document'

const categories: Category[] = [
  {
    id: 'trudovye',
    slug: 'trudovye',
    name: 'Трудовые',
    description: 'desc',
    metaTitle: 'Трудовые',
    metaDesc: 'meta',
    priority: 1,
  },
]

const hub: DocumentJson = {
  slug: 'hub-doc',
  categorySlug: 'trudovye',
  parentSlug: null,
  titleH1: 'H1',
  titleGen: 'Gen',
  metaTitle: 'Meta',
  metaDesc: 'Desc',
  leadShort: 'Short',
  leadFull: 'Full',
  legalBasis: 'Basis',
  templateBody: 'Template {{name}}',
  contentBody: 'Body',
  formFields: [{ name: 'name', label: 'Имя', type: 'text', required: true }],
  faq: [{ question: 'Q?', answer: 'A.' }],
  relatedIds: [],
  published: true,
  priority: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
}

describe('validateSeedData', () => {
  it('accepts valid hub and variation', () => {
    const variation: DocumentJson = {
      ...hub,
      slug: 'var-doc',
      parentSlug: 'hub-doc',
      relatedIds: ['hub-doc'],
    }
    expect(validateSeedData(categories, [hub, variation])).toEqual([])
  })

  it('rejects unknown relatedIds', () => {
    const bad = { ...hub, relatedIds: ['missing'] }
    const issues = validateSeedData(categories, [bad])
    expect(issues.some((i) => i.code === 'UNKNOWN_RELATED')).toBe(true)
  })
})

describe('mapDocuments', () => {
  it('maps category and parent references', () => {
    const variation: DocumentJson = {
      ...hub,
      slug: 'var-doc',
      parentSlug: 'hub-doc',
    }
    const mapped = mapDocuments([hub, variation], categories)
    const variationDoc = mapped.find((d) => d.slug === 'var-doc')
    expect(variationDoc?.category.slug).toBe('trudovye')
    expect(variationDoc?.parentId).toBe('hub-doc')
  })
})

describe('documentJsonSchema', () => {
  it('parses minimal valid document', () => {
    expect(documentJsonSchema.safeParse(hub).success).toBe(true)
    expect(categorySchema.safeParse(categories[0]).success).toBe(true)
  })
})
