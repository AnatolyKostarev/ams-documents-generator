import { getApiBaseUrl, getDataSource } from '@/shared/config/data-source'

import type { DocumentRepository } from './document-repository'
import { HttpDocumentRepository } from './http-document-repository'
import { MockDocumentRepository } from './mock-document-repository'

export function createDocumentRepository(): DocumentRepository {
  if (getDataSource() === 'http') {
    return new HttpDocumentRepository(getApiBaseUrl())
  }
  return new MockDocumentRepository()
}
