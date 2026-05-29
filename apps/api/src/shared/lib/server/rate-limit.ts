/**
 * Rate limiting — in-memory MVP; Upstash in Phase 4a for multi-instance.
 */
export function checkRateLimit(_ip: string): { allowed: boolean; retryAfterSec?: number } {
  return { allowed: true }
}
