import { z } from 'zod'

const formFieldOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
})

export const formFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['text', 'select', 'date', 'number']),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z.array(formFieldOptionSchema).optional(),
})

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
})

export const documentJsonSchema = z.object({
  slug: z.string().min(1),
  categorySlug: z.string().min(1),
  parentSlug: z.string().nullable(),
  titleH1: z.string().min(1),
  titleGen: z.string().min(1),
  metaTitle: z.string().min(1),
  metaDesc: z.string().min(1),
  leadShort: z.string().min(1),
  leadFull: z.string().min(1),
  legalBasis: z.string().min(1),
  templateBody: z.string().min(1),
  contentBody: z.string().min(1),
  formFields: z.array(formFieldSchema),
  faq: z.array(faqItemSchema),
  relatedIds: z.array(z.string()),
  published: z.boolean(),
  priority: z.number().int(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
})

export const categorySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  metaTitle: z.string().min(1),
  metaDesc: z.string().min(1),
  priority: z.number().int(),
})
