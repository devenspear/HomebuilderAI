'use client'

import { useState, useEffect } from 'react'
import Section from '@/components/ui/section'
import TermCard from '@/components/glossary/term-card'
import Progress from '@/components/ui/progress'
import Badge from '@/components/ui/badge'
import { Term } from '@/lib/types'
import terms from '@/data/terms.json'

export default function GlossaryPage() {
  const [completedTerms, setCompletedTerms] = useState<Set<string>>(new Set())
  const [actionsSaved, setActionsSaved] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('glossary-progress')
    if (saved) {
      const progress = JSON.parse(saved)
      setCompletedTerms(new Set(progress.completed || []))
      setActionsSaved(progress.actions || [])
    }
  }, [])

  const handleTermComplete = (termId: string) => {
    const newCompleted = new Set([...completedTerms, termId])
    const newActions = [...actionsSaved, `${termId}-action`]

    setCompletedTerms(newCompleted)
    setActionsSaved(newActions)

    localStorage.setItem('glossary-progress', JSON.stringify({
      completed: Array.from(newCompleted),
      actions: newActions
    }))
  }

  const completionRate = (completedTerms.size / terms.length) * 100
  const targetActionsSaved = 5

  return (
    <div className="space-y-8">
      {/* Progress Section */}
      <Section title="Your Progress">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Terms Mastered</span>
              <Badge variant={completionRate >= 80 ? 'success' : 'info'}>
                {completedTerms.size}/{terms.length}
              </Badge>
            </div>
            <Progress
              value={completionRate}
              color={completionRate >= 80 ? 'green' : 'sky'}
              showValue
            />
            {completionRate >= 80 && (
              <p className="text-sm text-green-400">🎉 Target reached! 80%+ mastery achieved</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Actions Saved</span>
              <Badge variant={actionsSaved.length >= targetActionsSaved ? 'success' : 'warning'}>
                {actionsSaved.length}/{targetActionsSaved}+
              </Badge>
            </div>
            <Progress
              value={(actionsSaved.length / targetActionsSaved) * 100}
              max={100}
              color={actionsSaved.length >= targetActionsSaved ? 'green' : 'orange'}
              showValue
            />
            {actionsSaved.length >= targetActionsSaved && (
              <p className="text-sm text-green-400">✓ Action goal achieved!</p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Success Metrics</h4>
            <ul className="text-xs space-y-1">
              <li className={completionRate >= 80 ? 'text-green-400' : 'text-slate-500 dark:text-white/60'}>
                {completionRate >= 80 ? '✓' : '○'} 80%+ quiz pass rate
              </li>
              <li className={actionsSaved.length >= targetActionsSaved ? 'text-green-400' : 'text-slate-500 dark:text-white/60'}>
                {actionsSaved.length >= targetActionsSaved ? '✓' : '○'} ≥5 actions saved
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Terms Grid */}
      <Section title="Aiglish™ Terms">
        <p className="text-slate-600 dark:text-white/80 text-sm mb-6">
          Click any term to start the 90-second learning journey: explainer → analogy → quiz → action.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(terms as Term[]).map((term) => (
            <TermCard
              key={term.id}
              term={term}
              onComplete={handleTermComplete}
              isCompleted={completedTerms.has(term.id)}
            />
          ))}
        </div>
      </Section>

      {/* Coming Soon Terms */}
      {terms.length < 22 && (
        <Section title="More Terms Coming Soon">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 22 - terms.length }, (_, i) => (
              <div key={i} className="card opacity-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-slate-200 dark:bg-white/20 rounded animate-pulse" />
                  <div className="h-4 bg-slate-200 dark:bg-white/20 rounded flex-1 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 dark:bg-white/10 rounded animate-pulse" />
                  <div className="h-3 bg-slate-100 dark:bg-white/10 rounded w-3/4 animate-pulse" />
                </div>
                <p className="text-xs text-slate-400 dark:text-white/40 mt-3">Term #{terms.length + i + 1}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
