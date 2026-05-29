import { generateRequestSchema } from '@docgenerator/shared'

import { checkRateLimit } from '@/shared/lib/server'

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const limit = checkRateLimit(ip)
  if (!limit.allowed) {
    return Response.json(
      { success: false, error: 'Too many requests' },
      {
        status: 429,
        headers: limit.retryAfterSec
          ? { 'Retry-After': String(limit.retryAfterSec) }
          : undefined,
      }
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = generateRequestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }

  return Response.json(
    {
      success: false,
      error: 'Not implemented',
      message: 'POST /api/generate — Phase 4a',
      received: { documentId: parsed.data.documentId, mode: parsed.data.mode },
    },
    { status: 501 }
  )
}
