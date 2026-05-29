import type { DocumentData } from '@docgenerator/shared'

import type { DocumentRepository } from './document-repository'

/** HTTP adapter — implementation in Phase 6 integration. */
export class HttpDocumentRepository implements DocumentRepository {
  constructor(private readonly baseUrl: string) {}

  async getAll(): Promise<DocumentData[]> {
    const res = await fetch(`${this.baseUrl}/documents`)
    if (!res.ok) throw new Error('Failed to load documents')
    return res.json() as Promise<DocumentData[]>
  }

  async getPublished(): Promise<DocumentData[]> {
    const res = await fetch(`${this.baseUrl}/documents?published=true`)
    if (!res.ok) throw new Error('Failed to load documents')
    return res.json() as Promise<DocumentData[]>
  }

  async getBySlug(slug: string): Promise<DocumentData | null> {
    const res = await fetch(`${this.baseUrl}/documents/${slug}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to load document')
    return res.json() as Promise<DocumentData>
  }

  async getHubsByCategory(categorySlug: string): Promise<DocumentData[]> {
    const res = await fetch(
      `${this.baseUrl}/categories/${categorySlug}/hubs`
    )
    if (!res.ok) throw new Error('Failed to load hubs')
    return res.json() as Promise<DocumentData[]>
  }

  async getVariationsByHub(hubSlug: string): Promise<DocumentData[]> {
    const res = await fetch(`${this.baseUrl}/documents/${hubSlug}/variations`)
    if (!res.ok) throw new Error('Failed to load variations')
    return res.json() as Promise<DocumentData[]>
  }

  async getByRoute(params: {
    categorySlug: string
    documentSlug: string
    variationSlug?: string
  }): Promise<DocumentData | null> {
    const slug = params.variationSlug ?? params.documentSlug
    const doc = await this.getBySlug(slug)
    if (!doc || doc.categorySlug !== params.categorySlug) return null
    if (params.variationSlug && doc.parentSlug !== params.documentSlug) {
      return null
    }
    if (!params.variationSlug && doc.parentId !== null) return null
    return doc
  }
}
