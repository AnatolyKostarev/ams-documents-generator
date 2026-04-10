import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategories, getDocuments } from '@/lib/mock'

interface CategoryPageProps {
  params: { category: string }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({ category: category.slug }))
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = (await getCategories()).find((c) => c.slug === params.category)
  const year = new Date().getFullYear()
  if (!category) return { title: 'Категория не найдена' }
  return {
    title: `${category.title} - образцы ${year}`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = (await getCategories()).find((c) => c.slug === params.category)
  if (!category) notFound()

  const documents = (await getDocuments()).filter(
    (d) => d.category.slug === category.slug && d.parentId === null,
  )

  return (
    <main className='mx-auto min-h-screen w-full max-w-5xl px-4 py-8'>
      <h1 className='text-3xl font-bold'>{category.title}</h1>
      <p className='mt-2 text-sm text-black/70'>{category.description}</p>
      <div className='mt-6 grid gap-3'>
        {documents.map((doc) => (
          <Link
            key={doc.id}
            href={`/${category.slug}/${doc.slug}/`}
            className='rounded border p-4 hover:bg-black/[.03]'
          >
            {doc.title}
          </Link>
        ))}
      </div>
    </main>
  )
}
