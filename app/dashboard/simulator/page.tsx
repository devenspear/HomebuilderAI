'use client'

import { useState } from 'react'
import Section from '@/components/ui/section'
import ScenarioSelector from '@/components/simulator/scenario-selector'
import EventTimeline from '@/components/simulator/event-timeline'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Progress from '@/components/ui/progress'
import { BuyerEvent, AutomationFire } from '@/lib/types'

interface Scenario {
  id: string
  name: string
  description: string
  events: BuyerEvent[]
  expectedFires: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export default function SimulatorPage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [simulation, setSimulation] = useState<{
    fires: AutomationFire[]
    kpis: any
  } | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runSimulation = async () => {
    if (!selectedScenario) return

    setIsRunning(true)
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: selectedScenario.events })
      })

      const data = await response.json()
      setSimulation(data)
    } catch (error) {
      console.error('Simulation failed:', error)
    }
    setIsRunning(false)
  }

  const resetSimulation = () => {
    setSimulation(null)
    setSelectedScenario(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Section title="AI Sales Flow™ Simulator">
        <div className="flex items-center justify-between">
          <p className="text-slate-600 dark:text-white/80 text-sm">
            Run buyer micro-behaviors through the rule engine and see which automations fire.
          </p>
          <div className="flex gap-3">
            {selectedScenario && (
              <Button onClick={runSimulation} loading={isRunning}>
                🎯 Run Simulation
              </Button>
            )}
            {simulation && (
              <Button variant="outline" onClick={resetSimulation}>
                Reset
              </Button>
            )}
          </div>
        </div>
      </Section>

      {!selectedScenario && (
        <ScenarioSelector onSelect={setSelectedScenario} selectedScenario={selectedScenario || undefined} />
      )}

      {selectedScenario && !simulation && (
        <Section title="Ready to Run">
          <div className="card border-sky-400/30 bg-sky-500/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">{selectedScenario.name}</h4>
                <p className="text-sm text-slate-600 dark:text-white/80">{selectedScenario.description}</p>
              </div>
              <Badge variant="info">{selectedScenario.events.length} events</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-white/60">
                Expected {selectedScenario.expectedFires} automations to fire
              </span>
              <Button onClick={runSimulation} loading={isRunning}>
                🎯 Run Simulation
              </Button>
            </div>
          </div>
        </Section>
      )}

      {simulation && selectedScenario && (
        <>
          {/* KPI Dashboard */}
          <Section title="Simulation Results">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-2xl font-bold text-sky-400 mb-1">
                  {simulation.fires.length}
                </div>
                <div className="text-sm text-slate-500 dark:text-white/60">Automations Fired</div>
                <div className="text-xs text-green-400 mt-1">
                  Expected: {selectedScenario.expectedFires}
                </div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  +{simulation.kpis.signalLockDelta}
                </div>
                <div className="text-sm text-slate-500 dark:text-white/60">Signal Lock</div>
                <Progress
                  value={simulation.kpis.signalLockDelta}
                  max={50}
                  color="green"
                  size="sm"
                  className="mt-2"
                />
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">
                  +{simulation.kpis.commitmentDelta}
                </div>
                <div className="text-sm text-slate-500 dark:text-white/60">Commitment</div>
                <Progress
                  value={simulation.kpis.commitmentDelta}
                  max={30}
                  color="orange"
                  size="sm"
                  className="mt-2"
                />
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  +{simulation.kpis.leadScoreDelta}
                </div>
                <div className="text-sm text-slate-500 dark:text-white/60">Lead Score</div>
                <Progress
                  value={simulation.kpis.leadScoreDelta}
                  max={100}
                  color="sky"
                  size="sm"
                  className="mt-2"
                />
              </div>
            </div>

            {simulation.fires.length > 0 && (
              <div className="mt-6 p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                <h4 className="font-semibold text-green-400 mb-2">
                  🎉 Success! {simulation.fires.length} automation(s) triggered
                </h4>
                <div className="text-sm text-green-300">
                  This buyer journey demonstrates strong purchase intent with multiple automation triggers.
                  {simulation.kpis.signalLockDelta >= 20 && " Signal Lock is high - ready for immediate OSC handoff."}
                  {simulation.kpis.commitmentDelta >= 15 && " Commitment score indicates decision-making progress."}
                </div>
              </div>
            )}
          </Section>

          {/* Timeline */}
          <Section title="Event Timeline & Automation Fires">
            <EventTimeline
              events={selectedScenario.events}
              fires={simulation.fires}
            />
          </Section>

          {/* Rule Analysis */}
          {simulation.fires.length > 0 && (
            <Section title="Fired Rules Analysis">
              <div className="space-y-4">
                {simulation.fires.map((fire, index) => (
                  <div key={index} className="card border-orange-400/30 bg-orange-500/5">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold">{fire.ruleId}</h4>
                      <Badge variant="warning">Rule Fired</Badge>
                    </div>
                    <p className="text-orange-300 mb-3">{fire.reason}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Triggered Actions:</h5>
                        <ul className="text-sm space-y-1">
                          {fire.actions.map((action, i) => (
                            <li key={i} className="text-slate-600 dark:text-white/80">• {action}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Score Impact:</h5>
                        <div className="text-sm space-y-1">
                          {fire.deltas.signalLock && (
                            <div className="text-sky-400">Signal Lock: +{fire.deltas.signalLock}</div>
                          )}
                          {fire.deltas.commitment && (
                            <div className="text-green-400">Commitment: +{fire.deltas.commitment}</div>
                          )}
                          {fire.deltas.leadScore && (
                            <div className="text-slate-900 dark:text-white">Lead Score: +{fire.deltas.leadScore}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Actions */}
          <Section title="Next Steps">
            <div className="flex gap-4">
              <Button onClick={() => setSelectedScenario(null)}>
                Try Another Scenario
              </Button>
              <Button variant="outline">
                Export Results
              </Button>
              <Button variant="outline">
                Adjust Rules
              </Button>
            </div>
          </Section>
        </>
      )}
    </div>
  )
}
