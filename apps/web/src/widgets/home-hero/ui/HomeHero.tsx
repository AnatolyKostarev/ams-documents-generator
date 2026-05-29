type HomeHeroProps = {
  sharedVersion: string
  stats: {
    dataSource: string
    categories: number
    documents: number
    hubs: number
    variations: number
  }
}

export function HomeHero({ sharedVersion, stats }: HomeHeroProps) {
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
      <p style={{ color: '#525252', marginBottom: '1rem' }}>
        Единый контракт и mock-данные подключены (этап 2). Маршруты документов —
        этап 3b.
      </p>
      <ul
        style={{
          color: '#404040',
          fontSize: '0.9375rem',
          marginBottom: '1rem',
          paddingLeft: '1.25rem',
        }}
      >
        <li>Источник данных: {stats.dataSource}</li>
        <li>Категорий: {stats.categories}</li>
        <li>Опубликованных документов: {stats.documents}</li>
        <li>Хабов: {stats.hubs} · вариаций: {stats.variations}</li>
      </ul>
      <p style={{ fontSize: '0.875rem', color: '#737373' }}>
        @docgenerator/shared v{sharedVersion}
      </p>
    </section>
  )
}
