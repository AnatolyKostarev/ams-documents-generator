import type { DocumentData } from '@docgenerator/shared'

export interface DocumentRepository {
  getAll(): Promise<DocumentData[]>
  getPublished(): Promise<DocumentData[]>
  getBySlug(slug: string): Promise<DocumentData | null>
  getHubsByCategory(categorySlug: string): Promise<DocumentData[]>
  getVariationsByHub(hubSlug: string): Promise<DocumentData[]>
  getByRoute(params: {
    categorySlug: string
    documentSlug: string
    variationSlug?: string
  }): Promise<DocumentData | null>
}
