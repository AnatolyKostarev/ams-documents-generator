import fs from 'fs'
import path from 'path'
import categoriesData from '@/data/categories.json'
import type { Category, DocumentData, FaqItem, FormField } from '@/types'

type RawDocument = {
  id: string
  slug: string
  categorySlug: string
  parentSlug: string | null
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

const categories = categoriesData as Category[]

function readRawDocuments(): RawDocument[] {
  const docsDir = path.join(process.cwd(), 'src', 'data', 'documents')
  const files = fs.readdirSync(docsDir).filter((file) => file.endsWith('.json'))
  return files.map((file) => {
    const content = fs.readFileSync(path.join(docsDir, file), 'utf-8')
    return JSON.parse(content) as RawDocument
  })
}

function mapRawToDocumentData(rawDocs: RawDocument[]): DocumentData[] {
  return rawDocs.map((raw) => {
    const category = categories.find((c) => c.slug === raw.categorySlug)
    if (!category) {
      throw new Error(`Category not found for document: ${raw.slug}`)
    }

    const parent = raw.parentSlug
      ? rawDocs.find((d) => d.slug === raw.parentSlug)
      : null

    return {
      id: raw.id,
      slug: raw.slug,
      categoryId: category.id,
      category,
      parentId: parent?.id ?? null,
      title: raw.title,
      titleGen: raw.titleGen,
      titleH1: raw.titleH1,
      metaTitle: raw.metaTitle,
      metaDesc: raw.metaDesc,
      legalBasis: raw.legalBasis,
      formFields: raw.formFields,
      templateBody: raw.templateBody,
      contentBody: raw.contentBody,
      faq: raw.faq,
      relatedIds: raw.relatedIds,
      priority: raw.priority,
      published: raw.published,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  })
}

const documents = mapRawToDocumentData(readRawDocuments())

export async function getCategories() {
  return categories
}

export async function getDocuments() {
  return documents.filter((d) => d.published)
}

export async function getDocument(category: string, document: string) {
  return documents.find(
    (d) => d.published && d.category.slug === category && d.slug === document,
  )
}

export async function getVariation(
  category: string,
  hub: string,
  variation: string,
) {
  const parent = documents.find(
    (d) => d.category.slug === category && d.slug === hub && d.parentId === null,
  )
  if (!parent) return null

  return documents.find(
    (d) =>
      d.published &&
      d.category.slug === category &&
      d.slug === variation &&
      d.parentId === parent.id,
  )
}
