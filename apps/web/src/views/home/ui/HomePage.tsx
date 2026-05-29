import { SHARED_PACKAGE_VERSION } from '@docgenerator/shared'

import { createCategoryRepository } from '@/entities/category'
import { createDocumentRepository } from '@/entities/document'
import { getDataSource } from '@/shared/config/data-source'
import { HomeHero } from '@/widgets/home-hero'

export async function HomePage() {
  const [categories, published] = await Promise.all([
    createCategoryRepository().getAll(),
    createDocumentRepository().getPublished(),
  ])

  const hubs = published.filter((doc) => doc.parentId === null)
  const variations = published.filter((doc) => doc.parentId !== null)

  return (
    <main>
      <HomeHero
        sharedVersion={SHARED_PACKAGE_VERSION}
        stats={{
          dataSource: getDataSource(),
          categories: categories.length,
          documents: published.length,
          hubs: hubs.length,
          variations: variations.length,
        }}
      />
    </main>
  )
}
