import type { PlaceholderContract } from '@docgenerator/shared'

/** Generated document payload stored between /api/generate and /api/pdf (ADR-002). */
export type GeneratedDocSession = {
  documentText: string
  meta?: PlaceholderContract
}

export interface SessionStore {
  set(id: string, data: GeneratedDocSession, ttlSec: number): void
  get(id: string): GeneratedDocSession | null
}

/** In-memory store for MVP single-instance (Railway). */
export class MapSessionStore implements SessionStore {
  private readonly store = new Map<
    string,
    { data: GeneratedDocSession; expiresAt: number }
  >()

  set(id: string, data: GeneratedDocSession, ttlSec: number): void {
    this.store.set(id, {
      data,
      expiresAt: Date.now() + ttlSec * 1000,
    })
  }

  get(id: string): GeneratedDocSession | null {
    const entry = this.store.get(id)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.store.delete(id)
      return null
    }
    return entry.data
  }
}

let sessionStore: SessionStore | null = null

export function getSessionStore(): SessionStore {
  if (!sessionStore) {
    sessionStore = new MapSessionStore()
  }
  return sessionStore
}
