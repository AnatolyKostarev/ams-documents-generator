import { randomUUID } from 'crypto'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getDocument } from '@/lib/mock'

const requestSchema = z.object({
  documentId: z.string().min(3).max(200),
  mode: z.enum(['filled', 'template']),
  fields: z.record(z.string(), z.string()).optional(),
})

export async function POST(req: NextRequest) {
  const body = requestSchema.parse(await req.json())
  const [category, slug] = body.documentId.split('/')
  const doc = await getDocument(category, slug)

  if (!doc) {
    return Response.json({ error: 'Document not found' }, { status: 404 })
  }

  const documentText =
    body.mode === 'template'
      ? doc.templateBody.replace(/\{\{[^}]+\}\}/g, '________________')
      : doc.templateBody

  return Response.json({
    success: true,
    sessionId: `sess_${randomUUID()}`,
    documentText,
  })
}
