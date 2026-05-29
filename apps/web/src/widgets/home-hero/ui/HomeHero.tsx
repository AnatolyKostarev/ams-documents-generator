type HomeHeroProps = {
  sharedVersion: string
}

export function HomeHero({ sharedVersion }: HomeHeroProps) {
  return (
    <section
      style={{
        margin: '0 auto',
        maxWidth: 720,
        padding: '3rem 1.5rem',
      }}
    >
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
        DocGenerator
      </h1>
      <p style={{ color: '#525252', marginBottom: '0.5rem' }}>
        Frontend skeleton (FSD + App Router). Контент и маршруты — этапы 2–3.
      </p>
      <p style={{ fontSize: '0.875rem', color: '#737373' }}>
        @docgenerator/shared v{sharedVersion}
      </p>
    </section>
  )
}
