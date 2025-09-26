'use client'

import { useState, useEffect } from 'react'
import Section from '@/components/ui/section'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Progress from '@/components/ui/progress'
import { Playbook } from '@/lib/types'
import playbooks from '@/data/playbooks.json'

export default function PlaybooksPage() {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isRunning, setIsRunning] = useState(false)

  const difficultyColors = {
    beginner: 'success' as const,
    intermediate: 'warning' as const,
    advanced: 'error' as const
  }

  const startPlaybook = (playbook: Playbook) => {
    setSelectedPlaybook(playbook)
    setCurrentStep(0)
    setCompletedSteps(new Set())
    setIsRunning(true)
  }

  const completeStep = (stepIndex: number) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]))
    if (stepIndex < (selectedPlaybook?.steps.length || 0) - 1) {
      setCurrentStep(stepIndex + 1)
    }
  }

  const resetPlaybook = () => {
    setSelectedPlaybook(null)
    setCurrentStep(0)
    setCompletedSteps(new Set())
    setIsRunning(false)
  }

  const getModuleIcon = (module: string) => {
    const icons: Record<string, string> = {
      glossary: '📚',
      simulator: '🎯',
      drips: '✉️',
      scoring: '⚖️',
      'bot-studio': '🤖',
      'frame-builder': '🏗️',
      audit: '🔍'
    }
    return icons[module] || '📋'
  }

  const getModulePath = (module: string) => {
    return `/dashboard/${module === 'bot-studio' ? 'bot-studio' : module === 'frame-builder' ? 'frame-builder' : module}`
  }

  const exportPlaybookReport = () => {
    if (!selectedPlaybook) return

    const report = {
      playbook: selectedPlaybook.name,
      completed_at: new Date().toISOString(),
      steps_completed: completedSteps.size,
      total_steps: selectedPlaybook.steps.length,
      completion_rate: (completedSteps.size / selectedPlaybook.steps.length) * 100,
      expected_kpis: selectedPlaybook.kpiTargets,
      modules_used: selectedPlaybook.modules
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedPlaybook.id}_report.json`
    a.click()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Section title="Playbooks & Cases">
        <div className="flex items-center justify-between">
          <p className="text-slate-600 dark:text-white/80 text-sm">
            30-minute guided wins that orchestrate Simulator, Drips, and other modules for specific scenarios.
          </p>
          {selectedPlaybook && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetPlaybook}>
                Choose Different Playbook
              </Button>
              <Button onClick={exportPlaybookReport}>
                📊 Export Report
              </Button>
            </div>
          )}
        </div>
      </Section>

      {!selectedPlaybook && (
        <Section title="Available Playbooks">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playbooks.map((playbook: any) => (
              <div
                key={playbook.id}
                className="card card-hover cursor-pointer"
                onClick={() => startPlaybook(playbook)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold">{playbook.name}</h3>
                  <Badge variant={difficultyColors[playbook.difficulty as keyof typeof difficultyColors] || 'info'} size="sm">
                    {playbook.difficulty}
                  </Badge>
                </div>

                <p className="text-sm text-slate-600 dark:text-white/80 mb-4">{playbook.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-white/60">Estimated time:</span>
                    <span className="text-sky-400">{playbook.estimatedTime}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-white/60">Modules used:</span>
                    <div className="flex gap-1">
                      {playbook.modules.slice(0, 3).map((module: string) => (
                        <span key={module} className="text-lg">
                          {getModuleIcon(module)}
                        </span>
                      ))}
                      {playbook.modules.length > 3 && (
                        <span className="text-slate-500 dark:text-white/60">+{playbook.modules.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-slate-500 dark:text-white/60 mb-1">Expected Results:</div>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(playbook.kpiTargets).slice(0, 2).map(([key, value]) => (
                        <Badge key={key} variant="info" size="sm">
                          {key}: {String(value)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-xs text-sky-400">Click to start this playbook →</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {selectedPlaybook && (
        <>
          {/* Playbook Progress */}
          <Section title={`${selectedPlaybook.name} - In Progress`}>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <h4 className="font-semibold mb-3">Progress</h4>
                <Progress
                  value={(completedSteps.size / selectedPlaybook.steps.length) * 100}
                  showValue
                  color={completedSteps.size === selectedPlaybook.steps.length ? 'green' : 'sky'}
                />
                <div className="text-sm text-slate-500 dark:text-white/60 mt-2">
                  {completedSteps.size} of {selectedPlaybook.steps.length} steps completed
                </div>
              </div>

              <div className="card">
                <h4 className="font-semibold mb-3">Expected KPIs</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(selectedPlaybook.kpiTargets).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-slate-500 dark:text-white/60 capitalize">{key.replace('_', ' ')}:</span>
                      <Badge variant="success" size="sm">{value}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h4 className="font-semibold mb-3">Modules</h4>
                <div className="space-y-2">
                  {selectedPlaybook.modules.map((module) => (
                    <a
                      key={module}
                      href={getModulePath(module)}
                      className="flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300"
                    >
                      <span>{getModuleIcon(module)}</span>
                      <span className="capitalize">{module.replace('-', ' ')}</span>
                      <span className="text-xs">→</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Steps */}
          <Section title="Implementation Steps">
            <div className="space-y-4">
              {selectedPlaybook.steps.map((step, index) => (
                <div
                  key={index}
                  className={`card ${
                    currentStep === index ? 'border-sky-400/50 bg-sky-500/10' :
                    completedSteps.has(index) ? 'border-green-400/50 bg-green-500/10' :
                    'opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      completedSteps.has(index) ? 'bg-green-500 text-white' :
                      currentStep === index ? 'bg-sky-500 text-white' :
                      'bg-white/10 text-white/60'
                    }`}>
                      {completedSteps.has(index) ? '✓' : step.step}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{step.title}</h4>
                        {currentStep === index && (
                          <Badge variant="info" size="sm">Current</Badge>
                        )}
                        {completedSteps.has(index) && (
                          <Badge variant="success" size="sm">Complete</Badge>
                        )}
                      </div>

                      <p className="text-sm text-white/80 mb-3">{step.description}</p>

                      <div className="p-3 bg-white/5 rounded-lg mb-3">
                        <h5 className="text-sm font-medium mb-1">Action Required:</h5>
                        <p className="text-sm text-sky-300">{step.action}</p>
                      </div>

                      {currentStep === index && !completedSteps.has(index) && (
                        <div className="flex gap-3">
                          <Button onClick={() => completeStep(index)}>
                            ✓ Mark Complete
                          </Button>
                          <Button variant="outline" size="sm">
                            Need Help?
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Completion */}
            {completedSteps.size === selectedPlaybook.steps.length && (
              <div className="card border-green-400/50 bg-green-500/10 text-center py-8">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  Playbook Complete!
                </h3>
                <p className="text-green-300 mb-6">
                  You&apos;ve successfully implemented the {selectedPlaybook.name} playbook.
                  Your automation is now live and ready to drive results.
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={exportPlaybookReport}>
                    📊 Download Implementation Report
                  </Button>
                  <Button variant="outline" onClick={resetPlaybook}>
                    🚀 Start Another Playbook
                  </Button>
                </div>
              </div>
            )}
          </Section>
        </>
      )}

      {/* Help Section */}
      {!selectedPlaybook && (
        <Section title="How Playbooks Work">
          <div className="card">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">What are Playbooks?</h4>
                <p className="text-sm text-slate-600 dark:text-white/80 mb-4">
                  Playbooks are step-by-step guides that orchestrate multiple modules to achieve
                  specific business outcomes in 30 minutes or less.
                </p>
                <ul className="text-sm text-slate-600 dark:text-white/70 space-y-1">
                  <li>• <strong>Guided Implementation:</strong> Clear step-by-step instructions</li>
                  <li>• <strong>Multi-Module:</strong> Combines Simulator, Drips, Scoring, etc.</li>
                  <li>• <strong>Measurable Results:</strong> Defined KPI targets for each playbook</li>
                  <li>• <strong>Export Ready:</strong> Get configurations for your CRM/tools</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Best Practices</h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-sky-500/20 rounded-lg">
                    <strong className="text-sky-400">💡 Start Simple:</strong>
                    <p className="text-sky-300">Begin with beginner playbooks before attempting advanced ones.</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <strong className="text-green-400">✅ Follow Order:</strong>
                    <p className="text-green-300">Complete steps in sequence for best results.</p>
                  </div>
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <strong className="text-orange-400">⚡ Test Everything:</strong>
                    <p className="text-orange-300">Validate each configuration before moving to the next step.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}
    </div>
  )
}
