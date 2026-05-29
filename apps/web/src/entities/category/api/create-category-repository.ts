import { getApiBaseUrl, getDataSource } from '@/shared/config/data-source'

import type { CategoryRepository } from './category-repository'
import { HttpCategoryRepository } from './http-category-repository'
import { MockCategoryRepository } from './mock-category-repository'

export function createCategoryRepository(): CategoryRepository {
  if (getDataSource() === 'http') {
    return new HttpCategoryRepository(getApiBaseUrl())
  }
  return new MockCategoryRepository()
}
