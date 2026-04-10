import { NextRequest } from 'next/server'
import { z } from 'zod'

const requestSchema = z.object({
  sessionId: z.string().min(5),
})

export async function POST(req: NextRequest) {
  const body = requestSchema.parse(await req.json())
  const fileContent = `PDF stub for ${body.sessionId}\nGenerated at ${new Date().toISOString()}`

  return new Response(fileContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="document.txt"',
    },
  })
}
