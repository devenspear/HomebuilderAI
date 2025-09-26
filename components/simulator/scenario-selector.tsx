'use client'

import { useState } from 'react'
import { BuyerEvent } from '@/lib/types'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'

interface Scenario {
  id: string
  name: string
  description: string
  events: BuyerEvent[]
  expectedFires: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface ScenarioSelectorProps {
  onSelect: (scenario: Scenario) => void
  selectedScenario?: Scenario
}

const scenarios: Scenario[] = [
  {
    id: 'first-timer',
    name: 'First-Time Buyer Journey',
    description: 'Young couple browsing starter homes, price-sensitive',
    difficulty: 'beginner',
    expectedFires: 2,
    events: [
      {
        ts: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        type: 'view_plan',
        props: { plan: 'The Camden', beds: 3, baths: 2, sqft: 1450 }
      },
      {
        ts: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
        type: 'view_plan',
        props: { plan: 'The Bristol', beds: 3, baths: 2, sqft: 1380 }
      },
      {
        ts: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        type: 'download_brochure',
        props: { plan: 'The Camden', document: 'pricing_sheet' }
      }
    ]
  },
  {
    id: 'move-in-ready',
    name: 'Urgent Move-In Timeline',
    description: 'Family needs home in 60 days, high engagement',
    difficulty: 'intermediate',
    expectedFires: 4,
    events: [
      {
        ts: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        type: 'view_plan',
        props: { plan: 'The Oakwood', beds: 4, baths: 3, sqft: 2100 }
      },
      {
        ts: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        type: 'zoom_lot',
        props: { lot: 'Lot 47', community: 'Riverside Estates', status: 'available' }
      },
      {
        ts: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        type: 'chat_message',
        props: { message: 'When is the earliest move-in date for Lot 47?', intent: 'timeline_inquiry' }
      },
      {
        ts: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
        type: 'return_visit',
        props: { referrer: 'direct', pages_viewed: 5, time_on_site: 420 }
      },
      {
        ts: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        type: 'cta_click',
        props: { button: 'Schedule Tour', page: '/communities/riverside-estates' }
      }
    ]
  },
  {
    id: 'luxury-shopper',
    name: 'High-End Luxury Buyer',
    description: 'Executive looking at premium lots, custom options',
    difficulty: 'advanced',
    expectedFires: 3,
    events: [
      {
        ts: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        type: 'view_plan',
        props: { plan: 'The Executive', beds: 5, baths: 4, sqft: 3200 }
      },
      {
        ts: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        type: 'zoom_lot',
        props: { lot: 'Premium Lot 12', community: 'The Estates', status: 'available', premium: true }
      },
      {
        ts: new Date(Date.now() - 129600000).toISOString(), // 1.5 days ago
        type: 'download_brochure',
        props: { plan: 'The Executive', document: 'customization_options' }
      },
      {
        ts: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        type: 'chat_message',
        props: { message: 'Can I add a wine cellar to The Executive plan?', intent: 'customization' }
      },
      {
        ts: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        type: 'return_visit',
        props: { referrer: 'google', pages_viewed: 8, time_on_site: 720 }
      }
    ]
  }
]

export default function ScenarioSelector({ onSelect, selectedScenario }: ScenarioSelectorProps) {
  const [customEvents, setCustomEvents] = useState<BuyerEvent[]>([])

  const difficultyColors = {
    beginner: 'success' as const,
    intermediate: 'warning' as const,
    advanced: 'error' as const
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Scenario</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`card cursor-pointer transition-all ${
                selectedScenario?.id === scenario.id
                  ? 'border-sky-400/50 bg-sky-500/10 card-hover'
                  : 'card-hover'
              }`}
              onClick={() => onSelect(scenario)}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold">{scenario.name}</h4>
                <Badge variant={difficultyColors[scenario.difficulty]} size="sm">
                  {scenario.difficulty}
                </Badge>
              </div>

              <p className="text-sm text-white/80 mb-4">{scenario.description}</p>

              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">
                  {scenario.events.length} events
                </span>
                <span className="text-sky-400">
                  ~{scenario.expectedFires} automations
                </span>
              </div>

              {selectedScenario?.id === scenario.id && (
                <div className="mt-3 p-2 bg-sky-500/20 rounded-lg">
                  <p className="text-xs text-sky-300">✓ Selected scenario</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedScenario && (
        <div className="card border-sky-400/30 bg-sky-500/5">
          <h4 className="font-semibold mb-3">Scenario Preview: {selectedScenario.name}</h4>
          <div className="space-y-2 mb-4">
            {selectedScenario.events.map((event, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="capitalize">{event.type.replace('_', ' ')}</span>
                <span className="text-white/60">
                  {new Date(event.ts).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
          <Button className="w-full">
            Run This Scenario →
          </Button>
        </div>
      )}

      {/* Custom Events Builder (Future) */}
      <div className="card opacity-50">
        <h4 className="font-semibold mb-2">Custom Scenario Builder</h4>
        <p className="text-sm text-white/60 mb-3">
          Build your own buyer journey with custom events and timing.
        </p>
        <Button variant="outline" disabled>
          Coming Soon
        </Button>
      </div>
    </div>
  )
}