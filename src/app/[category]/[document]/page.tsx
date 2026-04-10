import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DocumentWidget from '@/components/DocumentWidget'
import { getDocument, getDocuments } from '@/lib/mock'
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
} from '@/lib/schema'

interface DocPageProps {
  params: { category: string; document: string }
}

export async function generateStaticParams() {
  const docs = await getDocuments()
  return docs
    .filter((d) => d.parentId === null)
    .map((d) => ({ category: d.category.slug, document: d.slug }))
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const doc = await getDocument(params.category, params.document)
  if (!doc) return { title: 'Документ не найден' }
  const year = new Date().getFullYear()
  return {
    title: doc.metaTitle.replace('{year}', String(year)),
    description: doc.metaDesc.replace('{year}', String(year)),
  }
}

export default async function DocumentHubPage({ params }: DocPageProps) {
  const doc = await getDocument(params.category, params.document)
  if (!doc) notFound()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Главная', url: `${siteUrl}/` },
    { name: doc.category.title, url: `${siteUrl}/${doc.category.slug}/` },
    { name: doc.title, url: `${siteUrl}/${doc.category.slug}/${doc.slug}/` },
  ])
  const faqSchema = buildFaqSchema(doc)
  const howToSchema = buildHowToSchema(doc)

  return (
    <main className='mx-auto min-h-screen w-full max-w-4xl px-4 py-8'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <p className='text-sm text-black/60'>
        Главная / {doc.category.title} / {doc.title}
      </p>
      <h1 className='mt-2 text-3xl font-bold'>{doc.titleH1}</h1>
      <p className='mt-4 text-sm text-black/70'>{doc.legalBasis}</p>
      <DocumentWidget document={doc} />
    </main>
  )
}
