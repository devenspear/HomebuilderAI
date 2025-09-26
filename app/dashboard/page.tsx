'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Section from '@/components/ui/section'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Progress from '@/components/ui/progress'

interface ModuleStatus {
  name: string
  path: string
  icon: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  lastUsed?: string
  description: string
}

export default function Dashboard() {
  const [moduleStats, setModuleStats] = useState<ModuleStatus[]>([
    {
      name: 'Glossary Lab',
      path: '/dashboard/glossary',
      icon: '📚',
      status: 'not_started',
      progress: 0,
      description: 'Master 22 Aiglish™ terms for better sales conversations'
    },
    {
      name: 'Drips Generator',
      path: '/dashboard/drips',
      icon: '✉️',
      status: 'not_started',
      progress: 0,
      description: 'Create automated email sequences that convert'
    },
    {
      name: 'Simulator',
      path: '/dashboard/simulator',
      icon: '🎯',
      status: 'not_started',
      progress: 0,
      description: 'Test buyer journeys and optimize conversion paths'
    },
    {
      name: 'AI Visibility Audit',
      path: '/dashboard/audit',
      icon: '🔍',
      status: 'not_started',
      progress: 0,
      description: 'Analyze website visibility and get improvement recommendations'
    },
    {
      name: 'Lead Scoring',
      path: '/dashboard/scoring',
      icon: '⚖️',
      status: 'not_started',
      progress: 0,
      description: 'Fine-tune behavioral weights for better lead prioritization'
    },
    {
      name: 'AI Frame Builder',
      path: '/dashboard/frame-builder',
      icon: '🏗️',
      status: 'not_started',
      progress: 0,
      description: 'Optimize entity structure and eliminate naming drift'
    },
    {
      name: 'MarvelBot Studio',
      path: '/dashboard/bot-studio',
      icon: '🤖',
      status: 'not_started',
      progress: 0,
      description: 'Train your sales bot for better customer interactions'
    },
    {
      name: 'Playbooks',
      path: '/dashboard/playbooks',
      icon: '📋',
      status: 'not_started',
      progress: 0,
      description: 'Follow guided implementations for specific scenarios'
    }
  ])

  const [recentActivity, setRecentActivity] = useState<string[]>([])
  const [quickStats, setQuickStats] = useState({
    totalModules: 8,
    completedModules: 0,
    inProgressModules: 0,
    totalProgress: 0
  })

  useEffect(() => {
    // Load module progress from localStorage
    const savedProgress = localStorage.getItem('module_progress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setModuleStats(current =>
        current.map(module => ({
          ...module,
          progress: progress[module.path] || 0,
          status: progress[module.path] > 0 ?
            (progress[module.path] >= 100 ? 'completed' : 'in_progress') :
            'not_started',
          lastUsed: progress[`${module.path}_last_used`]
        }))
      )
    }

    // Load recent activity
    const savedActivity = localStorage.getItem('recent_activity')
    if (savedActivity) {
      setRecentActivity(JSON.parse(savedActivity).slice(0, 5))
    }
  }, [])

  useEffect(() => {
    // Update quick stats
    const completed = moduleStats.filter(m => m.status === 'completed').length
    const inProgress = moduleStats.filter(m => m.status === 'in_progress').length
    const totalProgress = moduleStats.reduce((sum, m) => sum + m.progress, 0) / moduleStats.length

    setQuickStats({
      totalModules: moduleStats.length,
      completedModules: completed,
      inProgressModules: inProgress,
      totalProgress
    })
  }, [moduleStats])

  const getStatusColor = (status: ModuleStatus['status']) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'warning'
      default: return 'info'
    }
  }

  const getStatusText = (status: ModuleStatus['status']) => {
    switch (status) {
      case 'completed': return 'Complete'
      case 'in_progress': return 'In Progress'
      default: return 'Not Started'
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <Section title="HomebuilderAI Interactive Dashboard">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg text-slate-900 dark:text-white/90 mb-2">
              Welcome to your AI sales optimization lab
            </p>
            <p className="text-slate-600 dark:text-white/70">
              Master Aiglish™, build automations, and optimize your conversion funnel with 8 powerful modules.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-sky-400">{quickStats.completedModules}</div>
              <div className="text-xs text-slate-500 dark:text-white/60">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{quickStats.inProgressModules}</div>
              <div className="text-xs text-slate-500 dark:text-white/60">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(quickStats.totalProgress)}%</div>
              <div className="text-xs text-slate-500 dark:text-white/60">Overall</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Quick Actions */}
      <Section title="Quick Start">
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/dashboard/glossary" className="card card-hover">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📚</span>
              <h3 className="font-semibold">New to Aiglish™?</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-white/80 mb-4">
              Start with the Glossary Lab to master the 22 AI terms that will transform your sales conversations.
            </p>
            <Button size="sm" className="w-full">Start Learning →</Button>
          </Link>

          <Link href="/dashboard/playbooks" className="card card-hover">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📋</span>
              <h3 className="font-semibold">Ready to Execute?</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-white/80 mb-4">
              Follow step-by-step playbooks for proven scenarios like move-in ready pushes and luxury buyer acceleration.
            </p>
            <Button size="sm" className="w-full">Browse Playbooks →</Button>
          </Link>

          <Link href="/dashboard/simulator" className="card card-hover">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎯</span>
              <h3 className="font-semibold">Want to Experiment?</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-white/80 mb-4">
              Use the Simulator to test different buyer journeys and see how your automation responds in real-time.
            </p>
            <Button size="sm" className="w-full">Start Simulating →</Button>
          </Link>
        </div>
      </Section>

      {/* Module Overview */}
      <Section title="Module Progress">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {moduleStats.map((module) => (
            <Link key={module.path} href={module.path} className="card card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{module.icon}</span>
                <Badge variant={getStatusColor(module.status)} size="sm">
                  {getStatusText(module.status)}
                </Badge>
              </div>
              <h4 className="font-semibold mb-2">{module.name}</h4>
              <p className="text-xs text-slate-500 dark:text-white/70 mb-3">{module.description}</p>

              <div className="space-y-2">
                <Progress value={module.progress} showValue />
                {module.lastUsed && (
                  <div className="text-xs text-slate-400 dark:text-white/50">
                    Last used: {new Date(module.lastUsed).toLocaleDateString()}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Section title="Recent Activity">
          <div className="card">
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  <span className="text-slate-600 dark:text-white/80">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Help & Resources */}
      <Section title="Resources & Support">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h4 className="font-semibold mb-3">🎓 Learning Path</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className={quickStats.completedModules >= 1 ? "text-green-400" : "text-slate-500 dark:text-white/60"}>
                  {quickStats.completedModules >= 1 ? "✓" : "1."}
                </span>
                <span>Complete Glossary Lab (foundation)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={quickStats.completedModules >= 3 ? "text-green-400" : "text-slate-500 dark:text-white/60"}>
                  {quickStats.completedModules >= 3 ? "✓" : "2."}
                </span>
                <span>Build sequences with Drips + Simulator</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={quickStats.completedModules >= 5 ? "text-green-400" : "text-slate-500 dark:text-white/60"}>
                  {quickStats.completedModules >= 5 ? "✓" : "3."}
                </span>
                <span>Optimize with Scoring + Audit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={quickStats.completedModules >= 8 ? "text-green-400" : "text-slate-500 dark:text-white/60"}>
                  {quickStats.completedModules >= 8 ? "✓" : "4."}
                </span>
                <span>Advanced: Frame Builder + Bot Studio</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 className="font-semibold mb-3">💡 Pro Tips</h4>
            <div className="space-y-2 text-sm text-slate-600 dark:text-white/80">
              <div>• <strong>Export Everything:</strong> Each module exports configs for your CRM</div>
              <div>• <strong>Follow Playbooks:</strong> Proven step-by-step implementations</div>
              <div>• <strong>Test Before Deploy:</strong> Always simulate your automations</div>
              <div>• <strong>Track Progress:</strong> Your work is saved locally across sessions</div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
