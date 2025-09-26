import { BuyerEvent, AutomationFire } from '@/lib/types'

export type Rule = { id: string; when:(ctx:any)=>boolean; then:(ctx:any)=>AutomationFire }

export function buildContext(events: BuyerEvent[]){
  const byType = new Map<string, BuyerEvent[]>()
  events.forEach(e => {
    if(!byType.has(e.type)) byType.set(e.type, [])
    byType.get(e.type)!.push(e)
  })
  return { events, byType }
}

export function runFlow(events: BuyerEvent[], rules: Rule[]): AutomationFire[] {
  const ctx = buildContext(events)
  return rules.filter(r => r.when(ctx)).map(r => r.then(ctx))
}
