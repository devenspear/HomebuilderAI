// HomebuilderAI Export Index for Subdomain Integration
// This file exports all dashboard modules and components for integration into URL1234.com

// Main Components
export { default as StandaloneSplash } from './components/standalone-splash'

// Dashboard Pages - Ready for Independent Import
export { default as MainDashboard } from './app/dashboard/page'
export { default as GlossaryLab } from './app/dashboard/glossary/page'
export { default as DripsGenerator } from './app/dashboard/drips/page'
export { default as Simulator } from './app/dashboard/simulator/page'
export { default as AIVisibilityAudit } from './app/dashboard/audit/page'
export { default as LeadScoring } from './app/dashboard/scoring/page'
export { default as AIFrameBuilder } from './app/dashboard/frame-builder/page'
export { default as MarvelBotStudio } from './app/dashboard/bot-studio/page'
export { default as Playbooks } from './app/dashboard/playbooks/page'

// UI Components
export { default as Section } from './components/ui/section'
export { default as Button } from './components/ui/button'
export { default as Badge } from './components/ui/badge'
export { default as Progress } from './components/ui/progress'
export { default as Modal } from './components/ui/modal'
export { Input, Textarea } from './components/ui/input'

// Theme System
export { ThemeProvider, useTheme } from './lib/theme-context'
export { default as ThemeToggle } from './components/theme-toggle'

// Module-specific Components
export { default as TermCard } from './components/glossary/term-card'
export { default as SequenceBuilder } from './components/drips/sequence-builder'
export { default as EventTimeline } from './components/simulator/event-timeline'
export { default as ScenarioSelector } from './components/simulator/scenario-selector'
export { default as WeightSlider } from './components/scoring/weight-slider'

// Types
export type { Term, BuyerEvent, AutomationFire } from './lib/types'

// Data
export { default as termsData } from './data/terms.json'
export { default as playbooksData } from './data/playbooks.json'

// Styles - Import this in your main app
export const HomebuilderAIStyles = './app/globals.css'

// Navigation Helper
export const dashboardModules = [
  { name: 'Overview', path: '/dashboard', icon: '📊', component: 'MainDashboard' },
  { name: 'Glossary Lab', path: '/dashboard/glossary', icon: '📚', component: 'GlossaryLab' },
  { name: 'Drips Generator', path: '/dashboard/drips', icon: '✉️', component: 'DripsGenerator' },
  { name: 'Simulator', path: '/dashboard/simulator', icon: '🎯', component: 'Simulator' },
  { name: 'AI Visibility Audit', path: '/dashboard/audit', icon: '🔍', component: 'AIVisibilityAudit' },
  { name: 'Lead Scoring', path: '/dashboard/scoring', icon: '⚖️', component: 'LeadScoring' },
  { name: 'AI Frame Builder', path: '/dashboard/frame-builder', icon: '🏗️', component: 'AIFrameBuilder' },
  { name: 'MarvelBot Studio', path: '/dashboard/bot-studio', icon: '🤖', component: 'MarvelBotStudio' },
  { name: 'Playbooks', path: '/dashboard/playbooks', icon: '📋', component: 'Playbooks' }
]