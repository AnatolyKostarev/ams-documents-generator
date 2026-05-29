import { SHARED_PACKAGE_VERSION } from '@docgenerator/shared'
import { HomeHero } from '@/widgets/home-hero'

export function HomePage() {
  return (
    <main>
      <HomeHero sharedVersion={SHARED_PACKAGE_VERSION} />
    </main>
  )
}
