import { Rule } from '@/packages/core/flow-engine'
import { AutomationFire } from './types'

const fire = (id:string, reason:string, actions:string[], deltas:AutomationFire['deltas']):AutomationFire =>
  ({ ruleId:id, reason, actions, deltas })

export const starterRules: Rule[] = [
  {
    id: 'revisit_plan_3x_48h',
    when: (ctx) => (ctx.byType.get('view_plan')?.length ?? 0) >= 3,
    then: () => fire('revisit_plan_3x_48h', 'Viewed same plan ≥3 times in 48h', ['send_email:seq_design_consult.step1','osc_handoff'], { signalLock:+0.12, commitment:+0.06, leadScore:+15 })
  }
]
