'use client'

import { useState } from 'react'
import Section from '@/components/ui/section'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Badge from '@/components/ui/badge'
import Progress from '@/components/ui/progress'
import { EntityConfig, Entity } from '@/lib/types'

interface AnalysisResult {
  url: string
  totalPages: number
  entitiesDetected: Record<string, number>
  namingDrift: {
    entity: string
    variations: string[]
    consistency: number
  }[]
  sigframeChecklist: {
    category: string
    items: Array<{
      task: string
      status: 'complete' | 'needs_work' | 'missing'
      priority: 'high' | 'medium' | 'low'
    }>
  }[]
  overallScore: number
}

export default function FrameBuilderPage() {
  const [sitemapUrl, setSitemapUrl] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const runAnalysis = async () => {
    if (!sitemapUrl) return

    setIsAnalyzing(true)

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Mock analysis results
    const mockResult: AnalysisResult = {
      url: sitemapUrl,
      totalPages: 147,
      entitiesDetected: {
        'Floorplans': 23,
        'Communities': 8,
        'Lots': 89,
        'Models': 15
      },
      namingDrift: [
        {
          entity: 'Floorplans',
          variations: ['Plan-A', 'The Camden', 'floorplan-bristol', 'FP_Oakwood'],
          consistency: 32
        },
        {
          entity: 'Lots',
          variations: ['Lot 47', 'lot-12-riverside', 'Homesite_23', 'HS-15'],
          consistency: 28
        },
        {
          entity: 'Communities',
          variations: ['Riverside Estates', 'riverside-community', 'The Estates'],
          consistency: 67
        }
      ],
      sigframeChecklist: [
        {
          category: 'Entity Naming',
          items: [
            { task: 'Standardize floorplan naming format', status: 'needs_work', priority: 'high' },
            { task: 'Implement canonical lot numbering', status: 'needs_work', priority: 'high' },
            { task: 'Consistent community naming', status: 'complete', priority: 'medium' }
          ]
        },
        {
          category: 'URL Structure',
          items: [
            { task: 'Hierarchical URL patterns (/community/plan/lot)', status: 'missing', priority: 'high' },
            { task: 'SEO-friendly slug generation', status: 'needs_work', priority: 'medium' },
            { task: 'Canonical URL implementation', status: 'needs_work', priority: 'medium' }
          ]
        },
        {
          category: 'Metadata & Schema',
          items: [
            { task: 'Property listing schema markup', status: 'missing', priority: 'high' },
            { task: 'Organization schema for builder', status: 'complete', priority: 'low' },
            { task: 'Breadcrumb navigation schema', status: 'needs_work', priority: 'medium' }
          ]
        }
      ],
      overallScore: 42
    }

    setAnalysis(mockResult)
    setIsAnalyzing(false)
  }

  const resetAnalysis = () => {
    setAnalysis(null)
    setSitemapUrl('')
  }

  const exportChecklist = () => {
    if (!analysis) return

    const checklist = {
      site: analysis.url,
      generated_at: new Date().toISOString(),
      overall_score: analysis.overallScore,
      tasks: analysis.sigframeChecklist.flatMap(category =>
        category.items.map(item => ({
          category: category.category,
          task: item.task,
          status: item.status,
          priority: item.priority
        }))
      ),
      naming_issues: analysis.namingDrift
    }

    const blob = new Blob([JSON.stringify(checklist, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sigframe_checklist.json'
    a.click()
  }

  const statusColors = {
    complete: 'success' as const,
    needs_work: 'warning' as const,
    missing: 'error' as const
  }

  const priorityColors = {
    high: 'error' as const,
    medium: 'warning' as const,
    low: 'info' as const
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Section title="AI Frame Builder">
        <div className="flex items-center justify-between">
          <p className="text-slate-600 dark:text-white/80 text-sm">
            Convert SEO-frame sites into AIO-frame sites with consistent entities and surfaced signals.
          </p>
          {analysis && (
            <Button variant="outline" onClick={resetAnalysis}>
              Analyze New Site
            </Button>
          )}
        </div>
      </Section>

      {/* URL Input */}
      {!analysis && (
        <Section title="Enter Sitemap URL">
          <div className="max-w-lg space-y-4">
            <Input
              label="Sitemap URL"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://yourbuilder.com/sitemap.xml"
              helper="Enter your website's sitemap URL to begin entity analysis"
            />
            <Button
              onClick={runAnalysis}
              disabled={!sitemapUrl}
              loading={isAnalyzing}
              className="w-full"
            >
              🔍 Analyze Site Structure
            </Button>

            {isAnalyzing && (
              <div className="space-y-3">
                <div className="text-sm text-sky-400">Analyzing site structure...</div>
                <Progress value={66} showValue className="animate-pulse" />
                <div className="text-xs text-white/60">
                  Detecting entities, checking naming patterns, generating recommendations...
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Overview */}
          <Section title="Analysis Overview">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-2xl font-bold text-sky-400 mb-1">
                  {analysis.totalPages}
                </div>
                <div className="text-sm text-slate-500 dark:text-white/60">Pages Analyzed</div>
              </div>

              <div className="card text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {Object.keys(analysis.entitiesDetected).length}
                </div>
                <div className="text-sm text-slate-500 dark:text-white/60">Entity Types</div>
              </div>

              <div className="card text-center">
                <div className={`text-2xl font-bold mb-1 ${
                  analysis.overallScore >= 70 ? 'text-green-400' :
                  analysis.overallScore >= 50 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {analysis.overallScore}%
                </div>
                <div className="text-sm text-slate-500 dark:text-white/60">AIO Score</div>
              </div>

              <div className="card text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">
                  {analysis.namingDrift.length}
                </div>
                <div className="text-sm text-slate-500 dark:text-white/60">Drift Issues</div>
              </div>
            </div>
          </Section>

          {/* Entities Detected */}
          <Section title="Entities Detected">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(analysis.entitiesDetected).map(([entity, count]) => (
                <div key={entity} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{entity}</h4>
                    <Badge variant="info" size="sm">{count}</Badge>
                  </div>
                  <Progress value={Math.min(count * 2, 100)} color="sky" size="sm" />
                  <div className="text-xs text-slate-500 dark:text-white/60 mt-1">
                    Found {count} instances
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Naming Drift Issues */}
          <Section title="Consistency Heatmap">
            <div className="space-y-4">
              {analysis.namingDrift.map((drift, index) => (
                <div key={index} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{drift.entity}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 dark:text-white/60">Consistency:</span>
                      <Badge variant={drift.consistency >= 70 ? 'success' : drift.consistency >= 50 ? 'warning' : 'error'}>
                        {drift.consistency}%
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Progress
                      value={drift.consistency}
                      color={drift.consistency >= 70 ? 'green' : drift.consistency >= 50 ? 'orange' : 'red'}
                      showValue
                    />
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-2">Naming Variations Found:</h5>
                    <div className="flex flex-wrap gap-2">
                      {drift.variations.map((variation, i) => (
                        <Badge key={i} variant="default" size="sm">
                          {variation}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-sky-500/10 rounded-lg">
                    <p className="text-sm text-sky-300">
                      💡 <strong>Recommendation:</strong> Standardize to format like &quot;{drift.entity}-{'{Name}'}-{'{Attribute}'}&quot;
                      (e.g., &ldquo;Plan-Camden-3BR-1450sf&rdquo;)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* SigFrame Checklist */}
          <Section title="SigFrame™ Checklist">
            <div className="space-y-6">
              {analysis.sigframeChecklist.map((category, index) => (
                <div key={index} className="card">
                  <h4 className="font-semibold mb-4">{category.category}</h4>
                  <div className="space-y-3">
                    {category.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            item.status === 'complete' ? 'bg-green-400' :
                            item.status === 'needs_work' ? 'bg-orange-400' : 'bg-red-400'
                          }`} />
                          <span className="text-sm">{item.task}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={priorityColors[item.priority]} size="sm">
                            {item.priority.toUpperCase()}
                          </Badge>
                          <Badge variant={statusColors[item.status]} size="sm">
                            {item.status === 'needs_work' ? 'NEEDS WORK' :
                             item.status === 'missing' ? 'MISSING' : 'COMPLETE'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-6">
              <Button onClick={exportChecklist}>
                📥 Export Checklist JSON
              </Button>
              <Button variant="outline">
                📋 Send to Project Management
              </Button>
              <Button variant="outline">
                🔗 Generate Implementation Guide
              </Button>
            </div>
          </Section>

          {/* Action Plan */}
          <Section title="Recommended Action Plan">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="font-semibold mb-3">Priority 1: High Impact Tasks</h4>
                <ul className="space-y-2 text-sm">
                  {analysis.sigframeChecklist
                    .flatMap(cat => cat.items)
                    .filter(item => item.priority === 'high')
                    .map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-red-400">•</span>
                        <span>{item.task}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="card">
                <h4 className="font-semibold mb-3">Implementation Timeline</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Week 1-2:</span>
                    <span className="text-red-400">High priority fixes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Week 3-4:</span>
                    <span className="text-orange-400">Medium priority items</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Week 5+:</span>
                    <span className="text-sky-400">Low priority enhancements</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                    <span>Expected Score Gain:</span>
                    <span className="text-green-400 font-medium">+35-50 points</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </>
      )}
    </div>
  )
}
