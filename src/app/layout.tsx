import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { DISCLAIMER } from '@/lib/constants'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'AMS Documents Generator',
  description: 'DocGenerator MVP starter',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ru'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <footer className='border-t border-black/10 p-4 text-center text-xs text-black/70'>
          {DISCLAIMER}
        </footer>
      </body>
    </html>
  )
}
