'use client'

import { useState } from 'react'
import { Step, Sequence } from '@/lib/types'
import { Input, Textarea } from '@/components/ui/input'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'

interface SequenceBuilderProps {
  onSave?: (sequence: Sequence) => void
  onGenerate?: (prompt: string) => void
  initialSequence?: Sequence
}

export default function SequenceBuilder({ onSave, onGenerate, initialSequence }: SequenceBuilderProps) {
  const [sequence, setSequence] = useState<Sequence>(initialSequence || {
    id: `seq_${Date.now()}`,
    name: '',
    persona: '',
    offer: '',
    objection: '',
    steps: []
  })
  const [generating, setGenerating] = useState(false)

  const addStep = () => {
    const newStep: Step = {
      id: `step_${Date.now()}`,
      dayOffset: sequence.steps.length + 1,
      channel: 'email',
      subject: '',
      body: '',
    }
    setSequence(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }))
  }

  const updateStep = (stepId: string, updates: Partial<Step>) => {
    setSequence(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    }))
  }

  const removeStep = (stepId: string) => {
    setSequence(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }))
  }

  const handleGenerate = async () => {
    setGenerating(true)
    const prompt = `Create a ${sequence.steps.length || 7}-touch drip sequence for:
- Persona: ${sequence.persona || 'homebuilder prospect'}
- Offer: ${sequence.offer || 'new construction homes'}
- Objection: ${sequence.objection || 'price concerns'}

Generate compelling email subjects and body content for each touch point.`

    if (onGenerate) {
      await onGenerate(prompt)
    }
    setGenerating(false)
  }

  return (
    <div className="space-y-6">
      {/* Sequence Config */}
      <div className="card space-y-4">
        <h3 className="text-lg font-semibold">Sequence Configuration</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Sequence Name"
            value={sequence.name}
            onChange={(e) => setSequence(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Move-in Ready Follow Up"
          />
          <Input
            label="Target Persona"
            value={sequence.persona}
            onChange={(e) => setSequence(prev => ({ ...prev, persona: e.target.value }))}
            placeholder="e.g., First-time homebuyer, families"
          />
          <Input
            label="Primary Offer"
            value={sequence.offer}
            onChange={(e) => setSequence(prev => ({ ...prev, offer: e.target.value }))}
            placeholder="e.g., Quick move-in homes, incentives"
          />
          <Input
            label="Common Objection"
            value={sequence.objection}
            onChange={(e) => setSequence(prev => ({ ...prev, objection: e.target.value }))}
            placeholder="e.g., Price, timeline, financing"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={handleGenerate} loading={generating} disabled={!sequence.persona}>
            🤖 Generate with AI
          </Button>
          <Button variant="outline" onClick={addStep}>
            + Add Step Manually
          </Button>
        </div>
      </div>

      {/* Steps Editor */}
      {sequence.steps.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Sequence Steps ({sequence.steps.length})
            </h3>
            <Badge variant="info">{sequence.steps.length}-touch sequence</Badge>
          </div>

          {sequence.steps.map((step, index) => (
            <div key={step.id} className="card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="default" size="sm">Day {step.dayOffset}</Badge>
                  <select
                    value={step.channel}
                    onChange={(e) => updateStep(step.id, { channel: e.target.value as 'email' | 'sms' })}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-sm"
                  >
                    <option value="email">📧 Email</option>
                    <option value="sms">📱 SMS</option>
                  </select>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep(step.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </Button>
              </div>

              <div className="grid gap-4">
                <Input
                  label={`${step.channel === 'email' ? 'Subject Line' : 'Day Offset'}`}
                  value={step.channel === 'email' ? step.subject || '' : step.dayOffset.toString()}
                  onChange={(e) => updateStep(step.id, step.channel === 'email' ?
                    { subject: e.target.value } :
                    { dayOffset: parseInt(e.target.value) || 1 }
                  )}
                  placeholder={step.channel === 'email' ?
                    "e.g., Still thinking about your new home?" :
                    "Days from previous step"
                  }
                />
                <Textarea
                  label={`${step.channel === 'email' ? 'Email' : 'SMS'} Content`}
                  value={step.body}
                  onChange={(e) => updateStep(step.id, { body: e.target.value })}
                  placeholder={step.channel === 'email' ?
                    "Hi {firstName}, I wanted to follow up on your interest in..." :
                    "Hi {firstName}, quick question about..."
                  }
                  className="min-h-[120px]"
                />
                {step.channel === 'email' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="CTA Label (optional)"
                      value={step.cta?.label || ''}
                      onChange={(e) => updateStep(step.id, {
                        cta: { ...step.cta, label: e.target.value, url: step.cta?.url || '' }
                      })}
                      placeholder="e.g., Schedule Tour, View Homes"
                    />
                    <Input
                      label="CTA URL (optional)"
                      value={step.cta?.url || ''}
                      onChange={(e) => updateStep(step.id, {
                        cta: { ...step.cta, url: e.target.value, label: step.cta?.label || '' }
                      })}
                      placeholder="e.g., https://builder.com/schedule"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Actions */}
      {sequence.steps.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Ready to Deploy?</h4>
              <p className="text-sm text-white/60">
                Export to your CRM or save as template
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                Export JSON
              </Button>
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
              <Button onClick={() => onSave?.(sequence)}>
                Save Sequence
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}