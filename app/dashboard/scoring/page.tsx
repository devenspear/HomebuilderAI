'use client'

import { useState, useEffect } from 'react'
import Section from '@/components/ui/section'
import WeightSlider from '@/components/scoring/weight-slider'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Progress from '@/components/ui/progress'
import { WeightConfig } from '@/lib/types'
import * as yaml from 'yaml'

export default function ScoringPage() {
  const [config, setConfig] = useState<WeightConfig>({
    weights: {},
    thresholds: { AAA: 80, A: 60, B: 40, C: 0 }
  })

  const [simulation, setSimulation] = useState<{
    distribution: Record<string, number>
    sampleLeads: Array<{ name: string; score: number; tier: string }>
  } | null>(null)

  const [descriptions, setDescriptions] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load weights from YAML (simulated)
    const defaultWeights = {
      view_plan: 3,
      zoom_lot: 5,
      download_brochure: 4,
      chat_message: 7,
      cta_click: 8,
      return_visit: 6,
      schedule_tour: 10,
      pricing_inquiry: 9,
      customization_request: 8,
      timeline_inquiry: 9,
      financing_question: 7,
      repeat_visitor: 5
    }

    const defaultDescriptions = {
      view_plan: "Viewed a floorplan page",
      zoom_lot: "Used lot map zoom feature",
      download_brochure: "Downloaded pricing or plan materials",
      chat_message: "Initiated chat conversation",
      cta_click: "Clicked primary call-to-action",
      return_visit: "Returned within 7 days",
      schedule_tour: "Requested property tour",
      pricing_inquiry: "Asked about pricing",
      customization_request: "Inquired about customizations",
      timeline_inquiry: "Asked about construction timeline",
      financing_question: "Inquired about financing options",
      repeat_visitor: "Multiple visits in 30 days"
    }

    setConfig(prev => ({ ...prev, weights: defaultWeights }))
    setDescriptions(defaultDescriptions)
  }, [])

  const updateWeight = (behavior: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      weights: { ...prev.weights, [behavior]: value }
    }))
  }

  const updateThreshold = (tier: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      thresholds: { ...prev.thresholds, [tier]: value }
    }))
  }

  const runSimulation = () => {
    // Simulate lead scoring distribution
    const leads = [
      { name: "Sarah M.", behaviors: ["view_plan", "download_brochure", "pricing_inquiry"], tier: "" },
      { name: "Mike T.", behaviors: ["view_plan", "zoom_lot", "return_visit", "chat_message"], tier: "" },
      { name: "Lisa K.", behaviors: ["schedule_tour", "financing_question", "customization_request"], tier: "" },
      { name: "David R.", behaviors: ["view_plan", "cta_click"], tier: "" },
      { name: "Emma W.", behaviors: ["pricing_inquiry", "timeline_inquiry", "repeat_visitor", "schedule_tour"], tier: "" },
      { name: "John B.", behaviors: ["view_plan"], tier: "" },
      { name: "Maria G.", behaviors: ["download_brochure", "chat_message", "return_visit", "cta_click"], tier: "" },
      { name: "Alex P.", behaviors: ["zoom_lot", "customization_request", "financing_question"], tier: "" }
    ]

    const scoredLeads = leads.map(lead => {
      const score = lead.behaviors.reduce((sum, behavior) =>
        sum + (config.weights[behavior] || 0), 0
      )

      let tier = 'C'
      if (score >= config.thresholds.AAA) tier = 'AAA'
      else if (score >= config.thresholds.A) tier = 'A'
      else if (score >= config.thresholds.B) tier = 'B'

      return { ...lead, score, tier }
    })

    const distribution = scoredLeads.reduce((acc, lead) => {
      acc[lead.tier] = (acc[lead.tier] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    setSimulation({ distribution, sampleLeads: scoredLeads })
  }

  const exportConfig = () => {
    const yamlString = yaml.stringify(config)
    const blob = new Blob([yamlString], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'score_config.yaml'
    a.click()
  }

  const tierColors = {
    AAA: 'success' as const,
    A: 'info' as const,
    B: 'warning' as const,
    C: 'error' as const
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Section title="Lead Scoring Workbench">
        <div className="flex items-center justify-between">
          <p className="text-slate-600 dark:text-white/80 text-sm">
            Tune behavioral weights and thresholds to see real-time distribution changes.
          </p>
          <div className="flex gap-3">
            <Button onClick={runSimulation}>
              🎯 Run Simulation
            </Button>
            <Button variant="outline" onClick={exportConfig}>
              📥 Export Config
            </Button>
          </div>
        </div>
      </Section>

      {/* Weight Controls */}
      <Section title="Behavioral Weights">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(config.weights).map(([behavior, weight]) => (
            <div key={behavior} className="card">
              <WeightSlider
                label={behavior.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                value={weight}
                onChange={(value) => updateWeight(behavior, value)}
                max={10}
                description={descriptions[behavior]}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Threshold Controls */}
      <Section title="Score Thresholds">
        <div className="grid md:grid-cols-4 gap-6">
          {Object.entries(config.thresholds)
            .sort(([,a], [,b]) => b - a)
            .map(([tier, threshold]) => (
            <div key={tier} className="card">
              <div className="flex items-center justify-between mb-3">
                <Badge variant={tierColors[tier as keyof typeof tierColors]} size="md">
                  Tier {tier}
                </Badge>
                <span className="text-lg font-bold text-primary bg-primary/10 px-2 py-1 rounded">{threshold}+</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={threshold}
                onChange={(e) => updateThreshold(tier, Number(e.target.value))}
                className="w-full h-3 bg-white/20 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${threshold}%, rgba(255,255,255,0.2) ${threshold}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              <div className="text-xs text-secondary mt-2">
                {tier === 'AAA' ? 'Immediate OSC handoff' :
                 tier === 'A' ? 'High priority follow-up' :
                 tier === 'B' ? 'Standard nurture sequence' :
                 'Basic drip campaign'}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Simulation Results */}
      {simulation && (
        <>
          <Section title="Live Distribution">
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              {Object.entries(simulation.distribution).map(([tier, count]) => (
                <div key={tier} className="card text-center">
                  <div className="text-3xl font-bold mb-2">
                    <Badge variant={tierColors[tier as keyof typeof tierColors]} size="md">
                      {count}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-white/60">Tier {tier}</div>
                  <div className="text-xs text-slate-400 dark:text-white/40 mt-1">
                    {Math.round((count / simulation.sampleLeads.length) * 100)}%
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h4 className="font-semibold mb-4">Sample Lead Cohort</h4>
              <div className="space-y-3">
                {simulation.sampleLeads.map((lead, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{lead.name}</span>
                      <Badge variant={tierColors[lead.tier as keyof typeof tierColors]} size="sm">
                        {lead.tier}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 dark:text-white/60">Score:</span>
                      <span className="font-semibold">{lead.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Insights */}
          <Section title="Scoring Insights">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="font-semibold mb-3">Current Configuration Impact</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>AAA Leads (Immediate Action):</span>
                    <span className="text-green-400 font-medium">
                      {simulation.distribution.AAA || 0} leads ({Math.round(((simulation.distribution.AAA || 0) / simulation.sampleLeads.length) * 100)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Value (A+AAA):</span>
                    <span className="text-sky-400 font-medium">
                      {(simulation.distribution.AAA || 0) + (simulation.distribution.A || 0)} leads
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Highest Weighted Behavior:</span>
                    <span className="text-orange-400 font-medium">
                      {Object.entries(config.weights).sort(([,a], [,b]) => b - a)[0][0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h4 className="font-semibold mb-3">Optimization Suggestions</h4>
                <ul className="text-sm space-y-2">
                  {(simulation.distribution.AAA || 0) < 2 && (
                    <li className="text-orange-300">• Consider lowering AAA threshold to catch more high-intent leads</li>
                  )}
                  {(simulation.distribution.C || 0) > simulation.sampleLeads.length / 2 && (
                    <li className="text-orange-300">• Many leads in Tier C - review minimum viable behaviors</li>
                  )}
                  {config.weights.schedule_tour < 8 && (
                    <li className="text-green-300">• Tour requests show high intent - consider higher weight</li>
                  )}
                  <li className="text-sky-300">• Current config prioritizes {Object.entries(config.weights).filter(([,w]) => w >= 8).map(([b]) => b).join(", ")} behaviors</li>
                </ul>
              </div>
            </div>
          </Section>
        </>
      )}

      {/* Usage Guide */}
      {!simulation && (
        <Section title="How to Use">
          <div className="card">
            <h4 className="font-semibold mb-3">Scoring Workbench Guide</h4>
            <ol className="text-sm space-y-2 text-slate-600 dark:text-white/80">
              <li>1. <strong>Adjust Weights:</strong> Set point values for each buyer behavior (0-10 scale)</li>
              <li>2. <strong>Set Thresholds:</strong> Define score ranges for AAA, A, B, C tiers</li>
              <li>3. <strong>Run Simulation:</strong> See how your changes affect lead distribution</li>
              <li>4. <strong>Optimize:</strong> Iterate based on insights and business goals</li>
              <li>5. <strong>Export:</strong> Download YAML config for your CRM integration</li>
            </ol>
            <div className="mt-4 p-3 bg-sky-500/20 rounded-lg border border-sky-500/30">
              <p className="text-sm text-sky-300">
                💡 <strong>Pro Tip:</strong> Start with high weights for commitment behaviors (tour requests, pricing questions)
                and lower weights for early-stage browsing behaviors.
              </p>
            </div>
          </div>
        </Section>
      )}
    </div>
  )
}
