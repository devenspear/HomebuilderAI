'use client'

import { useState } from 'react'
import Section from '@/components/ui/section'
import Button from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import Badge from '@/components/ui/badge'
import { BotPackage, Intent, HandoffRule } from '@/lib/types'

export default function BotStudioPage() {
  const [botPackage, setBotPackage] = useState<BotPackage>({
    intents: [],
    slots: [],
    responses: [],
    handoff: {}
  })

  const [currentStep, setCurrentStep] = useState<'intents' | 'handoff' | 'test' | 'export'>('intents')
  const [testConversation, setTestConversation] = useState<Array<{role: 'user' | 'bot', message: string}>>([])
  const [userMessage, setUserMessage] = useState('')

  const addIntent = () => {
    const newIntent: Intent = {
      id: `intent_${Date.now()}`,
      name: '',
      examples: [''],
      slots: []
    }
    setBotPackage(prev => ({
      ...prev,
      intents: [...prev.intents, newIntent]
    }))
  }

  const updateIntent = (id: string, updates: Partial<Intent>) => {
    setBotPackage(prev => ({
      ...prev,
      intents: prev.intents.map(intent =>
        intent.id === id ? { ...intent, ...updates } : intent
      )
    }))
  }

  const removeIntent = (id: string) => {
    setBotPackage(prev => ({
      ...prev,
      intents: prev.intents.filter(intent => intent.id !== id)
    }))
  }

  const simulateBot = async (message: string) => {
    // Simple bot simulation based on intents
    const intent = botPackage.intents.find(i =>
      i.examples.some(example =>
        example.toLowerCase().includes(message.toLowerCase()) ||
        message.toLowerCase().includes(example.toLowerCase())
      )
    )

    let response = "I'm sorry, I didn't understand that. Can you please rephrase?"

    if (intent) {
      switch (intent.name.toLowerCase()) {
        case 'pricing inquiry':
          response = "I'd be happy to help with pricing information! Our homes start from the mid $300s. Would you like me to connect you with a sales consultant who can provide detailed pricing for specific floorplans?"
          break
        case 'availability check':
          response = "We have several move-in ready homes available! The Camden plan has 2 homes ready for immediate occupancy, and the Bristol has 1. Would you like to schedule a tour?"
          break
        case 'schedule tour':
          response = "I'd love to help you schedule a tour! Let me connect you with our sales team right now. They'll be able to show you available times this week. One moment please..."
          break
        case 'financing questions':
          response = "Great question about financing! We work with several preferred lenders who can help with competitive rates and programs. Let me have our mortgage specialist contact you within the hour."
          break
        default:
          response = `I understand you're asking about ${intent.name.toLowerCase()}. Let me connect you with a team member who can give you detailed information.`
      }

      // Check for handoff conditions
      const shouldHandoff = checkHandoffConditions(message, intent)
      if (shouldHandoff) {
        response += "\n\n🔄 Transferring you to a sales consultant..."
      }
    }

    return response
  }

  const checkHandoffConditions = (message: string, intent?: Intent): boolean => {
    const handoffKeywords = botPackage.handoff.if_keywords || []
    const hasHandoffKeyword = handoffKeywords.some(keyword =>
      message.toLowerCase().includes(keyword.toLowerCase())
    )

    if (hasHandoffKeyword) return true
    if (intent?.name === 'Schedule Tour') return true
    if (intent?.name === 'Financing Questions') return true

    return false
  }

  const sendMessage = async () => {
    if (!userMessage.trim()) return

    const newConversation = [...testConversation, { role: 'user' as const, message: userMessage }]
    setTestConversation(newConversation)

    const botResponse = await simulateBot(userMessage)
    setTestConversation([...newConversation, { role: 'bot' as const, message: botResponse }])
    setUserMessage('')
  }

  const exportBotPackage = () => {
    const exportData = {
      ...botPackage,
      metadata: {
        name: 'MarvelBot Configuration',
        version: '1.0',
        created_at: new Date().toISOString(),
        total_intents: botPackage.intents.length
      }
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bot_package.json'
    a.click()
  }

  const presetIntents = [
    { name: 'Pricing Inquiry', examples: ['How much does it cost?', 'What are the prices?', 'Price range?'] },
    { name: 'Availability Check', examples: ['What homes are available?', 'Any quick move-ins?', 'Ready to move homes?'] },
    { name: 'Schedule Tour', examples: ['Can I schedule a tour?', 'Book appointment', 'Visit the model home'] },
    { name: 'Financing Questions', examples: ['Financing options?', 'Loan programs?', 'Down payment help?'] },
    { name: 'Floorplan Info', examples: ['Tell me about the Camden', 'Floorplan details', 'Square footage?'] }
  ]

  const loadPresetIntents = () => {
    const newIntents: Intent[] = presetIntents.map((preset, i) => ({
      id: `preset_${i}`,
      name: preset.name,
      examples: preset.examples,
      slots: []
    }))
    setBotPackage(prev => ({ ...prev, intents: newIntents }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Section title="MarvelBot™ Conversation Studio">
        <div className="flex items-center justify-between">
          <p className="text-slate-600 dark:text-white/80 text-sm">
            Train a purpose-built sales bot with homebuilding expertise and smart handoff rules.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={loadPresetIntents}>
              🚀 Load Presets
            </Button>
            <Button onClick={exportBotPackage}>
              📦 Export Bot Package
            </Button>
          </div>
        </div>
      </Section>

      {/* Step Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl">
          {[
            { key: 'intents', label: '1. Intents', icon: '🎯' },
            { key: 'handoff', label: '2. Handoff Rules', icon: '🔄' },
            { key: 'test', label: '3. Test Chat', icon: '💬' },
            { key: 'export', label: '4. Export', icon: '📦' }
          ].map(step => (
            <button
              key={step.key}
              onClick={() => setCurrentStep(step.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentStep === step.key
                  ? 'bg-sky-500 text-white'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {step.icon} {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on current step */}
      {currentStep === 'intents' && (
        <Section title="Define Intents & Responses">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-600 dark:text-white/80">
                Create intents that your bot should recognize and respond to appropriately.
              </p>
              <Button onClick={addIntent}>+ Add Intent</Button>
            </div>

            {botPackage.intents.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-slate-500 dark:text-white/60 mb-4">No intents defined yet</p>
                <Button onClick={loadPresetIntents} variant="outline">
                  Start with Preset Intents
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {botPackage.intents.map((intent, index) => (
                  <div key={intent.id} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Intent #{index + 1}</h4>
                      <Button variant="ghost" size="sm" onClick={() => removeIntent(intent.id)}>
                        Remove
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Intent Name"
                        value={intent.name}
                        onChange={(e) => updateIntent(intent.id, { name: e.target.value })}
                        placeholder="e.g., Pricing Inquiry"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Training Examples</label>
                      {intent.examples.map((example, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <Input
                            value={example}
                            onChange={(e) => {
                              const newExamples = [...intent.examples]
                              newExamples[i] = e.target.value
                              updateIntent(intent.id, { examples: newExamples })
                            }}
                            placeholder="e.g., How much does it cost?"
                          />
                          {intent.examples.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newExamples = intent.examples.filter((_, idx) => idx !== i)
                                updateIntent(intent.id, { examples: newExamples })
                              }}
                            >
                              ✕
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateIntent(intent.id, { examples: [...intent.examples, ''] })}
                      >
                        + Add Example
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>
      )}

      {currentStep === 'handoff' && (
        <Section title="Handoff Rules & Guardrails">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="font-semibold mb-4">Handoff Conditions</h4>
              <div className="space-y-4">
                <Input
                  label="Lead Score Threshold"
                  type="number"
                  value={botPackage.handoff.if_lead_score || ''}
                  onChange={(e) => setBotPackage(prev => ({
                    ...prev,
                    handoff: { ...prev.handoff, if_lead_score: Number(e.target.value) }
                  }))}
                  placeholder="e.g., 70"
                  helper="Handoff when lead score reaches this level"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Handoff Keywords</label>
                  <Textarea
                    value={(botPackage.handoff.if_keywords || []).join(', ')}
                    onChange={(e) => setBotPackage(prev => ({
                      ...prev,
                      handoff: {
                        ...prev.handoff,
                        if_keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }
                    }))}
                    placeholder="appointment, tour, financing, price"
                    helper="Comma-separated list of keywords that trigger handoff"
                  />
                </div>

                <Input
                  label="Route To"
                  value={botPackage.handoff.route_to || ''}
                  onChange={(e) => setBotPackage(prev => ({
                    ...prev,
                    handoff: { ...prev.handoff, route_to: e.target.value }
                  }))}
                  placeholder="osc_team@builder.com"
                  helper="Email or team to route conversations to"
                />
              </div>
            </div>

            <div className="card">
              <h4 className="font-semibold mb-4">Bot Guardrails</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                  <h5 className="font-medium text-green-400 mb-1">✓ Always Do</h5>
                  <ul className="text-sm text-green-300 space-y-1">
                    <li>• Offer human handoff for complex questions</li>
                    <li>• Collect contact info before providing pricing</li>
                    <li>• Stay positive and helpful</li>
                    <li>• Ask qualifying questions</li>
                  </ul>
                </div>

                <div className="p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                  <h5 className="font-medium text-red-400 mb-1">✗ Never Do</h5>
                  <ul className="text-sm text-red-300 space-y-1">
                    <li>• Make pricing commitments or negotiate</li>
                    <li>• Guarantee availability without checking</li>
                    <li>• Discuss competitor comparisons</li>
                    <li>• Handle complaints or issues</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {currentStep === 'test' && (
        <Section title="Test Your Bot">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="font-semibold mb-4">Live Chat Test</h4>
              <div className="h-80 bg-white/5 rounded-lg p-4 overflow-y-auto mb-4">
                {testConversation.length === 0 ? (
                  <div className="text-center text-slate-400 dark:text-white/40 mt-16">
                    <p>Start a conversation to test your bot...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {testConversation.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-3 py-2 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-sky-500 text-white'
                            : 'bg-white/10 text-white'
                        }`}>
                          <div className="text-xs text-slate-500 dark:text-white/60 mb-1">
                            {msg.role === 'user' ? 'You' : 'MarvelBot'}
                          </div>
                          <div className="text-sm">{msg.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!userMessage.trim()}>
                  Send
                </Button>
              </div>
            </div>

            <div className="card">
              <h4 className="font-semibold mb-4">Test Scenarios</h4>
              <div className="space-y-3">
                {[
                  'How much do your homes cost?',
                  'Do you have any move-in ready homes?',
                  'I want to schedule a tour',
                  'What financing options do you offer?',
                  'Tell me about the Camden floorplan'
                ].map((scenario, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setUserMessage(scenario)
                      setTimeout(() => sendMessage(), 100)
                    }}
                    className="w-full text-left p-3 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-sm transition-colors"
                  >
                    💬 &ldquo;{scenario}&rdquo;
                  </button>
                ))}
              </div>

              <div className="mt-6 p-3 bg-sky-500/20 rounded-lg border border-sky-500/30">
                <h5 className="font-medium text-sky-400 mb-2">Bot Performance</h5>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Intents Trained:</span>
                    <Badge variant="info" size="sm">{botPackage.intents.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Handoff Rules:</span>
                    <Badge variant="success" size="sm">
                      {Object.keys(botPackage.handoff).length > 0 ? 'Configured' : 'None'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {currentStep === 'export' && (
        <Section title="Export Bot Configuration">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="font-semibold mb-4">Bot Package Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total Intents:</span>
                  <Badge variant="info">{botPackage.intents.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Training Examples:</span>
                  <Badge variant="info">
                    {botPackage.intents.reduce((sum, intent) => sum + intent.examples.length, 0)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Handoff Rules:</span>
                  <Badge variant={Object.keys(botPackage.handoff).length > 0 ? 'success' : 'warning'}>
                    {Object.keys(botPackage.handoff).length > 0 ? 'Configured' : 'Not Set'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 className="font-semibold mb-4">Export Options</h4>
              <div className="space-y-3">
                <Button onClick={exportBotPackage} className="w-full">
                  📦 Download bot_package.json
                </Button>
                <Button variant="outline" className="w-full">
                  🔗 Deploy to Chatbot Platform
                </Button>
                <Button variant="outline" className="w-full">
                  📊 Generate Training Report
                </Button>
              </div>

              <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <p className="text-sm text-green-300">
                  ✅ <strong>Ready to Deploy!</strong> Your MarvelBot is configured with {botPackage.intents.length} intents
                  and smart handoff rules for optimal customer experience.
                </p>
              </div>
            </div>
          </div>
        </Section>
      )}
    </div>
  )
}
