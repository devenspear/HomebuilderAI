'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const modules = [
  { name: 'Overview', path: '/dashboard', icon: '📊', color: 'blue' },
  { name: 'Glossary Lab', path: '/dashboard/glossary', icon: '📚', color: 'green' },
  { name: 'Drips Generator', path: '/dashboard/drips', icon: '✉️', color: 'purple' },
  { name: 'Simulator', path: '/dashboard/simulator', icon: '🎯', color: 'orange' },
  { name: 'AI Visibility Audit', path: '/dashboard/audit', icon: '🔍', color: 'red' },
  { name: 'Lead Scoring', path: '/dashboard/scoring', icon: '⚖️', color: 'yellow' },
  { name: 'AI Frame Builder', path: '/dashboard/frame-builder', icon: '🏗️', color: 'indigo' },
  { name: 'MarvelBot Studio', path: '/dashboard/bot-studio', icon: '🤖', color: 'pink' },
  { name: 'Playbooks', path: '/dashboard/playbooks', icon: '📋', color: 'teal' }
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Fixed Glass Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 glass-nav z-40 pt-20">
        <div className="h-full overflow-y-auto">
          <div className="px-6 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-primary mb-2">Modules</h2>
              <p className="text-secondary text-lg">Choose a tool to get started</p>
            </div>

            <nav className="space-y-2">
              {modules.map((module) => {
                const isActive = pathname === module.path
                return (
                  <Link
                    key={module.path}
                    href={module.path}
                    className={clsx(
                      'group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200',
                      'hover:scale-[1.02] active:scale-[0.98]',
                      isActive ? (
                        'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-primary shadow-lg'
                      ) : (
                        'text-secondary hover:text-primary hover:bg-white/10 dark:hover:bg-white/5'
                      )
                    )}
                  >
                    <div className={clsx(
                      'w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform duration-200',
                      'group-hover:scale-110',
                      isActive ? (
                        'bg-gradient-to-br from-white/20 to-white/5 shadow-inner'
                      ) : (
                        'bg-white/5 dark:bg-white/10'
                      )
                    )}>
                      {module.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={clsx(
                        'font-semibold text-lg leading-tight',
                        isActive && 'text-gradient-subtle'
                      )}>
                        {module.name}
                      </div>
                      {isActive && (
                        <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1 opacity-60"></div>
                      )}
                    </div>
                    {isActive && (
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Quick Actions */}
            <div className="mt-12 p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10">
              <h3 className="font-semibold text-primary text-xl mb-2">Quick Start</h3>
              <p className="text-secondary text-base mb-3">New to HomebuilderAI?</p>
              <Link
                href="/dashboard/glossary"
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <span>🚀</span>
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  )
}