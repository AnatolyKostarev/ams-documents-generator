import { z } from 'zod'

import { generateModeSchema } from './generate'

export const pdfRequestSchema = z.object({
  sessionId: z.string().min(1),
  mode: generateModeSchema.optional(),
})

export type PdfRequest = z.infer<typeof pdfRequestSchema>
