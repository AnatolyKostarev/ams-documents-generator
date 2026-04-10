export interface Category {
  id: string
  slug: string
  title: string
  titleGen: string
  description: string
  priority: number
}

export interface FormField {
  id: string
  label: string
  type: 'text' | 'select' | 'date' | 'number'
  placeholder?: string
  hint?: string
  options?: string[]
  required: boolean
  gridCol: 'full' | 'half'
}

export interface FaqItem {
  question: string
  answer: string
}

export interface DocumentData {
  id: string
  slug: string
  categoryId: string
  category: Category
  parentId: string | null
  title: string
  titleGen: string
  titleH1: string
  metaTitle: string
  metaDesc: string
  legalBasis: string
  formFields: FormField[]
  templateBody: string
  contentBody: string
  faq: FaqItem[]
  relatedIds: string[]
  priority: number
  published: boolean
  createdAt: string
  updatedAt: string
}
