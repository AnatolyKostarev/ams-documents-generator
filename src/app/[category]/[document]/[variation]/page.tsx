import { notFound } from 'next/navigation'
import DocumentWidget from '@/components/DocumentWidget'
import { getDocuments, getVariation } from '@/lib/mock'
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
} from '@/lib/schema'

interface VariationPageProps {
  params: { category: string; document: string; variation: string }
}

export async function generateStaticParams() {
  const docs = await getDocuments()
  return docs
    .filter((d) => d.parentId !== null)
    .map((d) => {
      const parent = docs.find((p) => p.id === d.parentId)
      if (!parent) return null
      return {
        category: d.category.slug,
        document: parent.slug,
        variation: d.slug,
      }
    })
    .filter(Boolean) as Array<{
    category: string
    document: string
    variation: string
  }>
}

export default async function VariationPage({ params }: VariationPageProps) {
  const doc = await getVariation(
    params.category,
    params.document,
    params.variation,
  )
  if (!doc) notFound()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Главная', url: `${siteUrl}/` },
    { name: doc.category.title, url: `${siteUrl}/${doc.category.slug}/` },
    {
      name: params.document,
      url: `${siteUrl}/${doc.category.slug}/${params.document}/`,
    },
    {
      name: doc.title,
      url: `${siteUrl}/${doc.category.slug}/${params.document}/${doc.slug}/`,
    },
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
        Главная / {doc.category.title} / {params.document} / {doc.title}
      </p>
      <h1 className='mt-2 text-3xl font-bold'>{doc.titleH1}</h1>
      <p className='mt-4 text-sm text-black/70'>{doc.legalBasis}</p>
      <DocumentWidget document={doc} />
    </main>
  )
}
