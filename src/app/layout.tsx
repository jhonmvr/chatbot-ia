import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RAG MVP',
  description: 'Retrieval-Augmented Generation MVP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}