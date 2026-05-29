export type DataSource = 'mock' | 'http'

export function getDataSource(): DataSource {
  const value = process.env.NEXT_PUBLIC_DATA_SOURCE ?? 'mock'
  return value === 'http' ? 'http' : 'mock'
}

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
}
