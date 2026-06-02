import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'TaskEngine | Modern Task Management',
  description: 'Manage your tasks cleanly and efficiently.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1" 
        />
      </head>
      <body className={`${inter.className} bg-background text-on-background antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  )
}