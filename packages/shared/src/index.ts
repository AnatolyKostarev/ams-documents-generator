/**
 * Shared contract package — types, Zod schemas, and constants for web + api.
 * Full DocumentData contract is added in Phase 2 (data-contract-documents rule).
 */
export const SHARED_PACKAGE_VERSION = '0.0.0' as const

export type PlaceholderContract = {
  readonly _phase: 'foundation'
}
