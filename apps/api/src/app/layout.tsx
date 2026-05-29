import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DocGenerator API',
  description: 'Backend API service',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
        {children}
      </body>
    </html>
  )
}
