import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ThemeProvider } from '@/lib/theme-context'
import ThemeToggle from '@/components/theme-toggle'
import Button from '@/components/ui/button'
import SplashGate from '@/components/splash-gate'

export const metadata: Metadata = {
  title: 'HomebuilderAI Interactive',
  description: 'Aiglish, AI Frames, and AI Sales Flow — interactive lab'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ThemeProvider>
          <header className="glass-header sticky top-0 z-50">
            <div className="px-6 py-4 flex items-center justify-between w-full">
              <div className="flex items-center">
                <Link href="/home" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                    <span className="text-white font-bold text-lg">AI</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gradient leading-none">HomebuilderAI</h1>
                    <p className="text-xs text-secondary">Interactive</p>
                  </div>
                </Link>
              </div>
              <nav className="flex items-center gap-3">
                <Button variant="secondary" size="sm" href="/dashboard">
                  Dashboard
                </Button>
                <Button variant="primary" size="sm" href="/dashboard/glossary">
                  Start Learning
                </Button>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t" style={{ borderColor: 'rgba(var(--border-color), 0.3)' }}>
            <div className="container py-12 text-center">
              <div className="text-tertiary text-sm space-y-2">
                <div>
                  📚 Content and Trademarks by Myers Barnes Associates, Inc. Copyright © 2025. All rights reserved.
                </div>
                <div>
                  💻 Web application design and development by: Deven Spear Copyright © 2025 🚀
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
