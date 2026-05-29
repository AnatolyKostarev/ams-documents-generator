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

  return Response.json(
    {
      success: false,
      error: 'Not implemented',
      message: 'POST /api/generate — Phase 4a',
    },
    { status: 501 }
  )
}
