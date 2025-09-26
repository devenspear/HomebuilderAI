export type TermId =
  | 'aiglish' | 'disruption' | 'what_is_ai' | 'algorithm' | 'osc' | 'bot' | 'marvelbot'
  | 'feed_the_machine' | 'prompt' | 'output' | 'ai_sales_flow' | 'sales_funnel'
  | 'crm' | 'lead_scoring' | 'tech_stack' | 'scripts_drips' | 'ai_visibility'
  | 'website_intelligence' | 'builder_wrap' | 'signal_lock' | 'commitment' | 'integration'

export interface Term {
  id: TermId
  title: string
  oneLine: string
  explainer90s: string
  fieldAnalogy: string
  oneActionToday: string
  videoUrl?: string
  quiz: { question: string; answers: string[]; correctIndex: number }[]
}

export type BuyerEventType = 
  | 'view_plan' | 'zoom_lot' | 'download_brochure' | 'chat_message' | 'cta_click' | 'return_visit'

export interface BuyerEvent {
  ts: string
  type: BuyerEventType
  props: Record<string, any>
}

export interface AutomationFire {
  ruleId: string
  reason: string
  actions: string[]
  deltas: { signalLock?: number; commitment?: number; leadScore?: number }
}

export interface Step {
  id: string
  dayOffset: number
  channel: 'email'|'sms'
  subject?: string
  body: string
  cta?: { label: string; url: string }
}

export type FixCategory = 'naming'|'schema'|'signal'|'links'|'structure'
export interface FixItem {
  id: string
  category: FixCategory
  description: string
  impact: 'high'|'med'|'low'
  steps: string[]
}

export interface Entity {
  name: string
  patterns: string[]
  required_fields: string[]
}

export interface EntityConfig {
  entities: Entity[]
  canonical: Record<string, string>
}

export interface BotPackage {
  intents: Intent[]
  slots: Slot[]
  responses: Response[]
  handoff: HandoffRule
}

export interface Intent {
  id: string
  name: string
  examples: string[]
  slots: string[]
}

export interface Slot {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'boolean'
  required: boolean
}

export interface Response {
  id: string
  intent: string
  text: string
  actions?: string[]
}

export interface HandoffRule {
  if_lead_score?: number
  if_keywords?: string[]
  cooldown_minutes?: number
  route_to?: string
}

export interface WeightConfig {
  weights: Record<string, number>
  thresholds: {
    AAA: number
    A: number
    B: number
    C: number
  }
}

export interface PlaybookStep {
  step: number
  title: string
  description: string
  action: string
}

export interface Playbook {
  id: string
  name: string
  description: string
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  modules: string[]
  presetScenario: string
  thresholds: Record<string, number>
  sequenceTemplate: string
  kpiTargets: Record<string, string>
  steps: PlaybookStep[]
}

export interface AuditResult {
  score: number
  fixes: FixItem[]
  metrics: Record<string, any>
}

export interface Sequence {
  id: string
  name: string
  persona: string
  offer: string
  objection: string
  steps: Step[]
}
