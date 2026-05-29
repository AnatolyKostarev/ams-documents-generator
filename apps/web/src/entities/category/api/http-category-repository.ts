import type { Category } from '@docgenerator/shared'

import type { CategoryRepository } from './category-repository'

/** HTTP adapter — implementation in Phase 6 integration. */
export class HttpCategoryRepository implements CategoryRepository {
  constructor(private readonly baseUrl: string) {}

  async getAll(): Promise<Category[]> {
    const res = await fetch(`${this.baseUrl}/categories`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error('Failed to load categories')
    return res.json() as Promise<Category[]>
  }

  async getBySlug(slug: string): Promise<Category | null> {
    const res = await fetch(`${this.baseUrl}/categories/${slug}`, {
      next: { revalidate: 60 },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to load category')
    return res.json() as Promise<Category>
  }
}
