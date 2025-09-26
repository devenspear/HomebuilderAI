import { BuyerEvent } from '@/lib/types'

export function scoreLead(events: BuyerEvent[], weights: Record<string, number>): number {
  return events.reduce((s,e)=> s + (weights[e.type] ?? 0), 0)
}
