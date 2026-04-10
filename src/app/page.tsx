import Link from 'next/link'
import { getCategories } from '@/lib/mock'
import { buildSoftwareApplicationSchema, buildWebsiteSchema } from '@/lib/schema'

export default async function Home() {
  const categories = await getCategories()
  const websiteSchema = buildWebsiteSchema()
  const softwareSchema = buildSoftwareApplicationSchema()
  return (
    <main className='mx-auto min-h-screen w-full max-w-6xl px-4 py-8'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <h1 className='text-3xl font-bold sm:text-4xl'>
        Генератор документов онлайн - создать за 30 секунд
      </h1>
      <p className='mt-3 max-w-3xl text-sm text-black/70 sm:text-base'>
        Базовый каркас MVP: категории, трехуровневый роутинг и API-заглушки
        уже готовы.
      </p>

      <section className='mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${category.slug}/`}
            className='rounded-lg border border-black/10 p-4 transition hover:border-black/30'
          >
            <h2 className='font-semibold'>{category.title}</h2>
            <p className='mt-1 text-sm text-black/70'>{category.description}</p>
          </Link>
        ))}
      </section>

      <section className='mt-8 flex gap-3'>
        <Link href='/ai-generator/' className='rounded bg-black px-4 py-2 text-white'>
          AI Generator
        </Link>
        <Link href='/zayavleniya/na-otpusk/' className='rounded border px-4 py-2'>
          Пример хаба
        </Link>
        <Link
          href='/zayavleniya/na-otpusk/na-otpusk-bez-soderzhaniya/'
          className='rounded border px-4 py-2'
        >
          Пример вариации
        </Link>
      </section>
    </main>
  )
}
