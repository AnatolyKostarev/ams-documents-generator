import type { Category } from '@docgenerator/shared'

import { getSeedData } from '@/shared/lib/data/load-seed'

import type { CategoryRepository } from './category-repository'

export class MockCategoryRepository implements CategoryRepository {
  async getAll(): Promise<Category[]> {
    return getSeedData().categories
  }

  async getBySlug(slug: string): Promise<Category | null> {
    return (
      getSeedData().categories.find((category) => category.slug === slug) ??
      null
    )
  }
}
