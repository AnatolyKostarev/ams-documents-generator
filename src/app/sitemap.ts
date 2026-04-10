import type { MetadataRoute } from 'next'
import { getCategories, getDocuments } from '@/lib/mock'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const categories = await getCategories()
  const docs = await getDocuments()

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/${c.slug}/`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const docUrls: MetadataRoute.Sitemap = docs.map((d) => ({
    url: d.parentId
      ? `${siteUrl}/${d.category.slug}/${
          docs.find((p) => p.id === d.parentId)?.slug ?? ''
        }/${d.slug}/`
      : `${siteUrl}/${d.category.slug}/${d.slug}/`,
    lastModified: d.updatedAt,
    changeFrequency: 'monthly',
    priority: d.parentId ? 0.7 : 0.9,
  }))

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...categoryUrls,
    ...docUrls,
    {
      url: `${siteUrl}/ai-generator/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
