import { Inter, JetBrains_Mono } from 'next/font/google'
import "./globals.css"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata = {
  title: 'Babcock UMIS Portal',
  description: 'Student result and registration portal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  )
}
