import { NextRequest, NextResponse } from 'next/server'
import { BuyerEvent, AutomationFire } from '@/lib/types'
import * as yaml from 'yaml'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const events: BuyerEvent[] = body.events ?? []

  // Load rules from YAML
  const rulesPath = path.join(process.cwd(), 'data', 'rules.yaml')
  const rulesYaml = fs.readFileSync(rulesPath, 'utf8')
  const rules = yaml.parse(rulesYaml)

  // Simple rule engine simulation
  const fires: AutomationFire[] = []
  let totalSignalLock = 0
  let totalCommitment = 0
  let totalLeadScore = 0

  for (const rule of rules) {
    let shouldFire = false
    let reason = ''

    // Simple rule matching logic
    if (rule.id === 'brochure_download_premium') {
      const downloads = events.filter(e => e.type === 'download_brochure' &&
        e.props.document === 'pricing_sheet')
      if (downloads.length > 0) {
        shouldFire = true
        reason = `Downloaded pricing sheet - shows price consideration`
      }
    }

    if (rule.id === 'lot_zoom_multiple') {
      const lotViews = events.filter(e => e.type === 'zoom_lot')
      if (lotViews.length >= 2) {
        shouldFire = true
        reason = `Viewed ${lotViews.length} lots - actively comparing locations`
      }
    }

    if (rule.id === 'chat_timeline_urgent') {
      const timelineChats = events.filter(e => e.type === 'chat_message' &&
        e.props.intent === 'timeline_inquiry')
      if (timelineChats.length > 0) {
        shouldFire = true
        reason = `Asked about timeline: "${timelineChats[0].props.message}"`
      }
    }

    if (rule.id === 'return_visitor_engaged') {
      const engagedReturns = events.filter(e => e.type === 'return_visit' &&
        e.props.time_on_site > 300 && e.props.pages_viewed >= 5)
      if (engagedReturns.length > 0) {
        shouldFire = true
        reason = `High engagement return visit: ${engagedReturns[0].props.time_on_site}s, ${engagedReturns[0].props.pages_viewed} pages`
      }
    }

    if (rule.id === 'cta_schedule_tour') {
      const tourClicks = events.filter(e => e.type === 'cta_click' &&
        e.props.button === 'Schedule Tour')
      if (tourClicks.length > 0) {
        shouldFire = true
        reason = `Clicked "Schedule Tour" button - ready to visit property`
      }
    }

    if (rule.id === 'luxury_customization') {
      const customChats = events.filter(e => e.type === 'chat_message' &&
        e.props.intent === 'customization')
      if (customChats.length > 0) {
        shouldFire = true
        reason = `Asked about customization: "${customChats[0].props.message}"`
      }
    }

    if (shouldFire) {
      const fire: AutomationFire = {
        ruleId: rule.id,
        reason: reason,
        actions: rule.then || [],
        deltas: rule.deltas || {}
      }
      fires.push(fire)

      // Accumulate deltas
      totalSignalLock += rule.deltas?.signalLock || 0
      totalCommitment += rule.deltas?.commitment || 0
      totalLeadScore += rule.deltas?.leadScore || 0
    }
  }

  const kpis = {
    signalLockDelta: totalSignalLock,
    commitmentDelta: totalCommitment,
    leadScoreDelta: totalLeadScore,
    automationsFired: fires.length,
    eventsProcessed: events.length
  }

  return NextResponse.json({ fires, kpis })
}
