'use client'

import { useState, useEffect } from 'react'
import Section from '@/components/ui/section'
import SequenceBuilder from '@/components/drips/sequence-builder'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import { Sequence } from '@/lib/types'

export default function DripsPage() {
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [activeSequence, setActiveSequence] = useState<Sequence | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('drip-sequences')
    if (saved) {
      setSequences(JSON.parse(saved))
    }
  }, [])

  const handleSaveSequence = (sequence: Sequence) => {
    const updated = sequences.some(s => s.id === sequence.id)
      ? sequences.map(s => s.id === sequence.id ? sequence : s)
      : [...sequences, sequence]

    setSequences(updated)
    localStorage.setItem('drip-sequences', JSON.stringify(updated))
    setActiveSequence(null)
    setShowBuilder(false)
  }

  const handleGenerate = async (prompt: string) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'drips',
          prompt,
          config: {
            touchPoints: 7,
            persona: activeSequence?.persona,
            offer: activeSequence?.offer
          }
        })
      })

      const data = await response.json()
      if (data.result?.steps) {
        const updatedSequence = {
          ...activeSequence!,
          steps: data.result.steps
        }
        setActiveSequence(updatedSequence)
      }
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }

  const newSequence = () => {
    setActiveSequence({
      id: `seq_${Date.now()}`,
      name: '',
      persona: '',
      offer: '',
      objection: '',
      steps: []
    })
    setShowBuilder(true)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Section title="Scripts & Drips Generator">
        <div className="flex items-center justify-between">
          <p className="text-slate-600 dark:text-white/80 text-sm">
            Generate 5-21 touch sequences matched to persona, offer, and objection.
          </p>
          <Button onClick={newSequence}>
            + New Sequence
          </Button>
        </div>
      </Section>

      {/* Saved Sequences */}
      {sequences.length > 0 && (
        <Section title={`Saved Sequences (${sequences.length})`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sequences.map((seq) => (
              <div key={seq.id} className="card cursor-pointer card-hover" onClick={() => {
                setActiveSequence(seq)
                setShowBuilder(true)
              }}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold">{seq.name || 'Untitled Sequence'}</h4>
                  <Badge variant="info" size="sm">{seq.steps.length} steps</Badge>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-white/80">
                  {seq.persona && <p><span className="text-sky-400">Persona:</span> {seq.persona}</p>}
                  {seq.offer && <p><span className="text-sky-400">Offer:</span> {seq.offer}</p>}
                  {seq.objection && <p><span className="text-sky-400">Objection:</span> {seq.objection}</p>}
                </div>
                <div className="flex gap-2 mt-4">
                  {seq.steps.some(s => s.channel === 'email') && <Badge size="sm">📧 Email</Badge>}
                  {seq.steps.some(s => s.channel === 'sms') && <Badge size="sm">📱 SMS</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Builder */}
      {showBuilder && (
        <Section title={activeSequence?.id ? 'Edit Sequence' : 'Create New Sequence'}>
          <SequenceBuilder
            initialSequence={activeSequence || undefined}
            onSave={handleSaveSequence}
            onGenerate={handleGenerate}
          />
          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setShowBuilder(false)
                setActiveSequence(null)
              }}
            >
              Cancel
            </Button>
          </div>
        </Section>
      )}

      {/* Templates & Examples */}
      {sequences.length === 0 && !showBuilder && (
        <Section title="Quick Start Templates">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'First-Time Buyer Follow-Up',
                persona: 'First-time homebuyer',
                offer: 'Starter homes with incentives',
                objection: 'Down payment concerns',
                steps: 5
              },
              {
                name: 'Move-In Ready Push',
                persona: 'Families needing quick move',
                offer: 'Inventory homes ready now',
                objection: 'Timeline pressure',
                steps: 7
              },
              {
                name: 'Luxury Buyer Nurture',
                persona: 'Executive families',
                offer: 'Custom luxury homes',
                objection: 'Premium pricing',
                steps: 12
              }
            ].map((template, i) => (
              <div
                key={i}
                className="card cursor-pointer card-hover"
                onClick={() => {
                  setActiveSequence({
                    id: `template_${Date.now()}`,
                    name: template.name,
                    persona: template.persona,
                    offer: template.offer,
                    objection: template.objection,
                    steps: []
                  })
                  setShowBuilder(true)
                }}
              >
                <h4 className="font-semibold mb-2">{template.name}</h4>
                <div className="space-y-1 text-sm text-slate-600 dark:text-white/80">
                  <p><span className="text-sky-400">Persona:</span> {template.persona}</p>
                  <p><span className="text-sky-400">Objection:</span> {template.objection}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant="info" size="sm">{template.steps} touches</Badge>
                  <span className="text-xs text-sky-400">Click to customize →</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
