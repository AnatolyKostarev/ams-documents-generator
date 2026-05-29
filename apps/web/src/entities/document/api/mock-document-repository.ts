import type { DocumentData } from '@docgenerator/shared'

import { getSeedData } from '@/shared/lib/data/load-seed'

import type { DocumentRepository } from './document-repository'

export class MockDocumentRepository implements DocumentRepository {
  async getAll(): Promise<DocumentData[]> {
    return getSeedData().documents
  }

  async getPublished(): Promise<DocumentData[]> {
    return getSeedData().documents.filter((doc) => doc.published)
  }

  async getBySlug(slug: string): Promise<DocumentData | null> {
    return (
      getSeedData().documents.find((doc) => doc.slug === slug) ?? null
    )
  }

  async getHubsByCategory(categorySlug: string): Promise<DocumentData[]> {
    return getSeedData().documents.filter(
      (doc) => doc.categorySlug === categorySlug && doc.parentId === null
    )
  }

  async getVariationsByHub(hubSlug: string): Promise<DocumentData[]> {
    return getSeedData().documents.filter((doc) => doc.parentId === hubSlug)
  }

  async getByRoute({
    categorySlug,
    documentSlug,
    variationSlug,
  }: {
    categorySlug: string
    documentSlug: string
    variationSlug?: string
  }): Promise<DocumentData | null> {
    const slug = variationSlug ?? documentSlug
    const doc = await this.getBySlug(slug)
    if (!doc || doc.categorySlug !== categorySlug) return null

    if (variationSlug) {
      if (doc.parentSlug !== documentSlug) return null
    } else if (doc.parentId !== null) {
      return null
    }

    return doc
  }
}
