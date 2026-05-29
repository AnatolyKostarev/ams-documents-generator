import type { Category } from '@docgenerator/shared'

export interface CategoryRepository {
  getAll(): Promise<Category[]>
  getBySlug(slug: string): Promise<Category | null>
}
