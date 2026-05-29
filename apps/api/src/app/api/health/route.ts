import { getServerEnv } from '@/shared/lib/server'

export async function GET() {
  const env = getServerEnv()
  return Response.json({
    status: 'ok',
    service: 'docgenerator-api',
    nodeEnv: env.NODE_ENV,
    databaseConfigured: Boolean(env.DATABASE_URL),
  })
}
