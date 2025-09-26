import { NextRequest, NextResponse } from 'next/server'
import { Step } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { kind, prompt, config } = body

  // Simulate AI generation with realistic homebuilder content
  if (kind === 'drips') {
    const steps: Step[] = []
    const touchPoints = config?.touchPoints || 7
    const persona = config?.persona || 'homebuyer'
    const offer = config?.offer || 'new homes'

    const emailTemplates = [
      {
        subject: "Your dream home journey starts here 🏡",
        body: `Hi {firstName},\n\nThank you for your interest in our ${offer}! I'm excited to help you find the perfect home.\n\nBased on your search criteria, I think you'll love our {CommunityName} community. The {PlanName} floorplan caught your attention for good reason - it's one of our most popular designs.\n\nWhat's the most important feature you're looking for in your new home?\n\nI'd love to schedule a personal tour when convenient for you.\n\nBest,\n{SalesRep}`
      },
      {
        subject: "Quick question about your home timeline",
        body: `Hi {firstName},\n\nI hope you're doing well! I wanted to check in about your home search timeline.\n\nSince we last spoke, we've had some exciting developments:\n• New incentives available through month-end\n• Additional quick move-in homes\n• Special financing options\n\nAre you still looking to move within the next 6 months? I'd love to show you what's available.\n\nWhen works best for a quick 15-minute call?\n\n{SalesRep}`
      },
      {
        subject: "New homes just released in {CommunityName}",
        body: `Hi {firstName},\n\nGreat news! We just released Phase 2 of {CommunityName} with some incredible homesites.\n\nRemembering your interest in the {PlanName}, I immediately thought of lot #{LotNumber}. It offers:\n\n✓ Premium corner lot with extra privacy\n✓ Available for immediate start\n✓ $10K builder incentive (limited time)\n✓ Estimated completion in {Timeline} months\n\nWould you like to walk this lot this weekend?\n\nBest,\n{SalesRep}`
      }
    ]

    const smsTemplates = [
      "Hi {firstName}! Quick check-in on your home search. Any questions about {CommunityName}? - {SalesRep}",
      "New incentives just announced for {CommunityName}! Worth a quick call? - {SalesRep}",
      "{firstName}, that lot we discussed is still available. Interest in seeing it this week? - {SalesRep}"
    ]

    // Generate email sequence
    for (let i = 0; i < Math.min(touchPoints, emailTemplates.length); i++) {
      steps.push({
        id: `email_${i + 1}`,
        dayOffset: [0, 3, 7][i] || i * 4,
        channel: 'email',
        subject: emailTemplates[i].subject,
        body: emailTemplates[i].body,
        cta: {
          label: ['Schedule Tour', 'Book Call', 'View Homesites'][i] || 'Learn More',
          url: 'https://builder.com/schedule'
        }
      })
    }

    // Add SMS follow-ups for longer sequences
    if (touchPoints > 3) {
      steps.push({
        id: 'sms_1',
        dayOffset: 10,
        channel: 'sms',
        body: smsTemplates[0]
      })
    }

    if (touchPoints > 5) {
      steps.push({
        id: 'sms_2',
        dayOffset: 14,
        channel: 'sms',
        body: smsTemplates[1]
      })
    }

    return NextResponse.json({
      result: {
        steps,
        metadata: {
          generated_at: new Date().toISOString(),
          touch_points: steps.length,
          persona,
          offer,
          estimated_metrics: {
            reply_rate: '+22%',
            booking_rate: '+18%',
            sequence_completion: '78%'
          }
        }
      }
    })
  }

  if (kind === 'term') {
    // Enhanced term generation
    return NextResponse.json({
      result: {
        explainer90s: "This term represents a key concept in AI-powered homebuilding sales. Understanding it helps teams deploy automation effectively and measure results consistently.",
        fieldAnalogy: "Like a compass for navigation, this concept guides decision-making in complex sales scenarios.",
        oneActionToday: "Identify one area where this concept could improve your current sales process."
      }
    })
  }

  if (kind === 'bot') {
    return NextResponse.json({
      result: {
        intents: [
          { id: 'pricing_inquiry', name: 'Pricing Questions', examples: ['How much does it cost?', 'What are the prices?'] },
          { id: 'availability', name: 'Availability Check', examples: ['What homes are available?', 'Any quick move-ins?'] },
          { id: 'schedule_tour', name: 'Tour Request', examples: ['Can I schedule a tour?', 'Book appointment'] }
        ],
        guardrails: ['No pricing commitments', 'Always offer human handoff', 'Collect contact info first'],
        handoff_logic: {
          triggers: ['appointment request', 'financing questions', 'price negotiation'],
          route_to: 'osc_team@builder.com'
        }
      }
    })
  }

  return NextResponse.json({ error: 'unknown kind' }, { status: 400 })
}
