import { Geist } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'HyperTrader',
  description: 'Trading journal for Hyperliquid traders',
}
const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <Providers>
        <body className="bg-background text-foreground">{children}</body>
      </Providers>
    </html>
  )
}
