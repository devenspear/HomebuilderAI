'use client'

import { useState } from 'react'
import Section from '@/components/ui/section'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Progress from '@/components/ui/progress'
import Badge from '@/components/ui/badge'
import { FixItem, AuditResult } from '@/lib/types'

export default function AuditPage() {
  const [siteUrl, setSiteUrl] = useState('')
  const [result, setResult] = useState<AuditResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runAudit = async () => {
    if (!siteUrl) return

    setIsRunning(true)
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: siteUrl })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Audit failed:', error)
    }
    setIsRunning(false)
  }

  const resetAudit = () => {
    setResult(null)
    setSiteUrl('')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green'
    if (score >= 60) return 'orange'
    return 'red'
  }

  const impactColors = {
    high: 'error' as const,
    med: 'warning' as const,
    low: 'info' as const
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Section title="AI Visibility & Website Intelligence Audit">
        <div className="flex items-center justify-between">
          <p className="text-slate-600 dark:text-white/80 text-sm">
&ldquo;Can AI see you?&rdquo; Get a score and prioritized fix list for your website.
          </p>
          {result && (
            <Button variant="outline" onClick={resetAudit}>
              Run New Audit
            </Button>
          )}
        </div>
      </Section>

      {/* URL Input */}
      {!result && (
        <Section title="Enter Website URL">
          <div className="max-w-md space-y-4">
            <Input
              label="Website URL"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://yourbuilder.com"
              helper="Enter your homebuilder website URL to audit AI visibility"
            />
            <Button
              onClick={runAudit}
              disabled={!siteUrl}
              loading={isRunning}
              className="w-full"
            >
              🔍 Run AI Visibility Audit
            </Button>
          </div>
        </Section>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Score Dashboard */}
          <Section title="Audit Results">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  result.score >= 80 ? 'text-green-400' :
                  result.score >= 60 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {result.score}
                </div>
                <div className="text-sm text-slate-500 dark:text-white/60 mb-3">AI Visibility Score</div>
                <Progress
                  value={result.score}
                  max={100}
                  color={getScoreColor(result.score)}
                  showValue
                />
                <div className="text-xs mt-2">
                  {result.score >= 80 ? '🎉 Excellent AI visibility!' :
                   result.score >= 60 ? '⚠️ Good but needs improvement' :
                   '❌ Poor AI visibility - needs attention'}
                </div>
              </div>

              <div className="card text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {result.fixes.filter(f => f.impact === 'high').length}
                </div>
                <div className="text-sm text-slate-500 dark:text-white/60">High Impact Issues</div>
                <div className="text-xs text-red-300 mt-1">
                  Critical fixes needed
                </div>
              </div>

              <div className="card text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">
                  {result.fixes.filter(f => f.impact === 'med').length}
                </div>
                <div className="text-sm text-slate-500 dark:text-white/60">Medium Impact Issues</div>
                <div className="text-xs text-orange-300 mt-1">
                  Important improvements
                </div>
              </div>
            </div>

            {result.score < 80 && (
              <div className="mt-6 p-4 bg-orange-500/20 rounded-xl border border-orange-500/30">
                <h4 className="font-semibold text-orange-400 mb-2">
                  ⚠️ Action Required
                </h4>
                <p className="text-sm text-orange-300">
                  Your website needs improvement to be fully visible to AI systems.
                  Focus on the high-impact fixes below to improve your score significantly.
                </p>
              </div>
            )}
          </Section>

          {/* Fix Categories */}
          <Section title="Top Priority Fixes">
            <div className="space-y-4">
              {result.fixes
                .sort((a, b) => {
                  const impactOrder = { high: 3, med: 2, low: 1 }
                  return impactOrder[b.impact] - impactOrder[a.impact]
                })
                .slice(0, 10)
                .map((fix, index) => (
                <div key={fix.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{fix.description}</h4>
                        <Badge variant={impactColors[fix.impact]} size="sm" className="mt-1">
                          {fix.impact.toUpperCase()} IMPACT
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="default" size="sm">
                      {fix.category}
                    </Badge>
                  </div>

                  <div className="pl-11">
                    <h5 className="font-medium mb-2">Steps to Fix:</h5>
                    <ol className="text-sm space-y-1">
                      {fix.steps.map((step, i) => (
                        <li key={i} className="text-slate-600 dark:text-white/80">
                          {i + 1}. {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Summary & Export */}
          <Section title="Summary & Next Steps">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="font-semibold mb-3">Audit Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Issues Found:</span>
                    <span className="font-medium">{result.fixes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Fix Time:</span>
                    <span className="font-medium">
                      {result.fixes.filter(f => f.impact === 'high').length * 2 +
                       result.fixes.filter(f => f.impact === 'med').length} hours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Score Gain:</span>
                    <span className="font-medium text-green-400">
                      +{Math.min(100 - result.score, result.fixes.length * 3)} points
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h4 className="font-semibold mb-3">Export Options</h4>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full">
                    📄 Export PDF Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    📊 Export to CSV
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    🔗 Send to Project Management
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-sky-500/20 rounded-xl border border-sky-500/30">
              <h4 className="font-semibold text-sky-400 mb-2">
                💡 Recommended Next Steps
              </h4>
              <ol className="text-sm text-sky-300 space-y-1">
                <li>1. Start with all HIGH impact fixes (fastest score improvement)</li>
                <li>2. Focus on &ldquo;naming&rdquo; and &ldquo;schema&rdquo; categories first</li>
                <li>3. Re-run audit after fixes to track improvement</li>
                <li>4. Set up monthly audits to maintain AI visibility</li>
              </ol>
            </div>
          </Section>
        </>
      )}

      {/* Example Sites */}
      {!result && (
        <Section title="Try Example Audits">
          <p className="text-sm text-slate-500 dark:text-white/60 mb-4">
            Test the audit tool with these sample homebuilder sites:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Traditional Builder', url: 'traditionalbuilder.com', score: 45 },
              { name: 'Modern Homes Co', url: 'modernhomes.com', score: 78 },
              { name: 'Luxury Estates', url: 'luxuryestates.com', score: 62 }
            ].map((example, i) => (
              <div
                key={i}
                className="card cursor-pointer card-hover"
                onClick={() => setSiteUrl(example.url)}
              >
                <h4 className="font-semibold mb-2">{example.name}</h4>
                <p className="text-sm text-slate-500 dark:text-white/60 mb-3">{example.url}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Estimated Score:</span>
                  <Badge variant={example.score >= 70 ? 'success' : 'warning'} size="sm">
                    {example.score}/100
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
