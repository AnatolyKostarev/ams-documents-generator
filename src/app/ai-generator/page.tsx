import { buildSoftwareApplicationSchema } from '@/lib/schema'

export default function AiGeneratorPage() {
  const softwareSchema = buildSoftwareApplicationSchema()
  return (
    <main className='mx-auto min-h-screen w-full max-w-4xl px-4 py-8'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <h1 className='text-3xl font-bold'>AI Generator</h1>
      <p className='mt-3 text-sm text-black/70'>
        Временная страница P2. Позже здесь будет отдельный flow генерации через
        AI.
      </p>
    </main>
  )
}
