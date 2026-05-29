import type { Category } from './category'
import type { FaqItem } from './faq'
import type { FormField } from './form-field'

export type DocumentCategoryRef = Pick<Category, 'id' | 'slug' | 'name'>

/** Normalized document shape used by UI, API, and future Prisma layer. */
export type DocumentData = {
  id: string
  slug: string
  categoryId: string
  categorySlug: string
  category: DocumentCategoryRef
  parentId: string | null
  parentSlug: string | null
  titleH1: string
  titleGen: string
  metaTitle: string
  metaDesc: string
  leadShort: string
  leadFull: string
  legalBasis: string
  templateBody: string
  contentBody: string
  formFields: FormField[]
  faq: FaqItem[]
  relatedIds: string[]
  published: boolean
  priority: number
  createdAt: string
  updatedAt: string
}

/** JSON seed file shape (before category/parent resolution). */
export type DocumentJson = {
  slug: string
  categorySlug: string
  parentSlug: string | null
  titleH1: string
  titleGen: string
  metaTitle: string
  metaDesc: string
  leadShort: string
  leadFull: string
  legalBasis: string
  templateBody: string
  contentBody: string
  formFields: FormField[]
  faq: FaqItem[]
  relatedIds: string[]
  published: boolean
  priority: number
  createdAt: string
  updatedAt: string
}
