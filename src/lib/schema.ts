import type { DocumentData } from '@/types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildFaqSchema(document: DocumentData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: document.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function buildHowToSchema(document: DocumentData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Как создать ${document.titleGen}`,
    step: [
      { '@type': 'HowToStep', name: 'Выберите режим' },
      { '@type': 'HowToStep', name: 'Заполните поля формы' },
      { '@type': 'HowToStep', name: 'Получите текст документа' },
      { '@type': 'HowToStep', name: 'Скачайте PDF' },
    ],
  }
}

export function buildSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AMS Documents Generator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB',
    },
  }
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AMS Documents Generator',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}
