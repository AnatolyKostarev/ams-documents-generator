import { z } from 'zod'

export const generateModeSchema = z.enum(['filled', 'template'])

export const generateRequestSchema = z.object({
  documentId: z.string().min(1),
  mode: generateModeSchema,
  fields: z.record(z.string(), z.string()).optional(),
})

export const generateResponseSchema = z.object({
  success: z.boolean(),
  documentText: z.string().optional(),
  sessionId: z.string().optional(),
  error: z.string().optional(),
})

export type GenerateMode = z.infer<typeof generateModeSchema>
export type GenerateRequest = z.infer<typeof generateRequestSchema>
export type GenerateResponse = z.infer<typeof generateResponseSchema>
