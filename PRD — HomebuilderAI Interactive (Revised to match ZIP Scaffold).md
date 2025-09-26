# **PRD — HomebuilderAI Interactive (Revised to match ZIP Scaffold)**

*Purpose-built for Claude Code + Next.js starter you downloaded.*

------

## **Product Objective**

- **Teach → Prove → Apply:** Turn the 22 Aiglish™ concepts into actions that sales/marketing teams can deploy on their sites and CRMs.
- **Outcome:** Shared language, AI-visible websites, deterministic automations, and shippable sequences.

------

## **Primary Users**

- **Sales Leaders/Trainers:** Shared vocabulary, repeatable playbooks, proof of lift.
- **OSCs & Onsite Sales:** Scripts, drips, bot handoff clarity, commitment triggers.
- **Marketing/IT:** From SEO frames to AI frames; entity naming, schema, integration tasks.

------

## **In-Scope (v1)**

- Modules in the ZIP: **Glossary, Frame Builder, Simulator, Drips, Audit, Bot Studio, Scoring, Playbooks.**
- Local JSON/YAML configs; file uploads (sitemap URLs, CSV).
- Stubbed generation endpoints designed for Claude handoff.

**Out-of-Scope (v1)**

- Multi-tenant auth/roles, production crawlers at scale, paid messaging integrations, PII storage.

------

## **Experience Pillars (Modules)**

### **A) Aiglish™ Glossary Lab**

**Goal:** Rapid mastery of 22 terms with “do it now” actions.
 **Key UX:** Grid of terms → Drawer with 90-sec explainer, analogy, action → 1-question quiz.
 **Data:** `data/terms.json` (extendable).
 **Success:** 80%+ quiz pass; ≥5 “actions saved” per user.

**Term schema (TypeScript)**

```ts
export interface Term {
  id: TermId; title: string; oneLine: string;
  explainer90s: string; fieldAnalogy: string; oneActionToday: string;
  videoUrl?: string;
  quiz: { question: string; answers: string[]; correctIndex: number }[];
}
```

------

### **B) AI Frame Builder**

**Goal:** Convert SEO-frame sites into AIO-frame sites with consistent entities and surfaced signals.
 **Key UX:** Enter sitemap URL → Entity detection → Consistency Heatmap → SigFrame™ Checklist export.
 **Artifacts:** `sigframe_checklist.json`, `heatmap.csv`.
 **Success:** Detect ≥80% naming drift; export tasks ready for project tools.

**Entity config (JSON)**

```json
{
  "entities":[
    {"name":"Floorplan","patterns":["plan","floorplan","fp-"],"required_fields":["beds","baths","sqft","starting_price"]},
    {"name":"Model","patterns":["model","home-model"],"required_fields":["name","community","gallery"]},
    {"name":"Lot","patterns":["lot","homesite"],"required_fields":["lot_number","status","price","plan_compatibility"]}
  ],
  "canonical":{
    "floorplan":"Plan-{PlanName}-{Beds}BR-{SqFt}sf",
    "lot":"Lot-{LotNumber}-{Community}-{Status}"
  }
}
```

------

### **C) AI Sales Flow™ Simulator**

**Goal:** Show how micro-behaviors trigger automations, **Signal Lock**, and **Commitment** deltas.
 **Key UX:** Pick scenario → Adjust thresholds → Run → Timeline of fires with **“why fired”**.
 **Config:** `lib/rules.ts` (loads from `data/rules.yaml` as you expand).
 **Success:** Deterministic fires; human-readable reasons; KPI deltas shown.

**Events & fires (TS)**

```ts
export interface BuyerEvent { ts: string; type: 'view_plan'|'zoom_lot'|'download_brochure'|'chat_message'|'cta_click'|'return_visit'; props: Record<string,any>; }
export interface AutomationFire { ruleId: string; reason: string; actions: string[]; deltas: { signalLock?: number; commitment?: number; leadScore?: number } }
```

------

### **D) MarvelBot™ Conversation Studio**

**Goal:** Train a purpose-built sales bot; prove lift vs. a generic bot; enforce handoff rules.
 **Key UX:** Import FAQs/scripts → Define intents/entities → Guardrails + handoff logic → A/B transcript viewer → Export bot package.
 **Artifacts:** `bot_package.json` (intents, slots, responses, handoff rules).
 **Success:** Clear handoff moments; higher appointment rate from chat.

**Handoff rules (JSON)**

```json
{"handoff":{"if_lead_score":">=70","if_keywords":["appointment","tour","financing"],"cooldown_minutes":15,"route_to":"osc_team@builder.com"}}
```

------

### **E) Lead Scoring Workbench**

**Goal:** Tune behavioral weights and thresholds; see distribution and tier promotions.
 **Key UX:** Sliders for weights → Cohort simulation → AAA/A/B/C thresholds.
 **Artifacts:** `score_config.yaml`.
 **Success:** Visible movement in AAA/A leads when knobs change.

**Weights (YAML)**

```yaml
weights: { view_plan: 3, zoom_lot: 5, brochure_dl: 4, return_visit_7d: 6 }
thresholds: { AAA: 80, A: 60, B: 40, C: 0 }
```

------

### **F) Scripts & Drips Generator**

**Goal:** Ship 5–21-touch sequences matched to flows/objections.
 **Key UX:** Pick persona/offer/objection → Generate (Claude) → Edit → Publish/Export.
 **Artifacts:** `sequence.json`, CSV/HTML exports (add easily).
 **Success:** Valid tokens; measurable reply/booking lift.

**Step schema (TS)**

```ts
export interface Step { id: string; dayOffset: number; channel: 'email'|'sms'; subject?: string; body: string; cta?: { label: string; url: string } }
```

------

### **G) AI Visibility & Website Intelligence Audit**

**Goal:** “Can AI see you?” score + prioritized fix list.
 **Key UX:** Run audit → Score dial → Top 10 fixes with step-by-step remediation.
 **Artifacts:** `audit_report.json` (score, fixes, metrics).
 **Success:** Score improves after re-run; fix completion rate visible.

**Fix item (TS)**

```ts
export interface FixItem { id: string; category: 'naming'|'schema'|'signal'|'links'|'structure'; description: string; impact: 'high'|'med'|'low'; steps: string[] }
```

------

### **H) Playbooks & Cases**

**Goal:** 30-minute guided wins connected to Simulator + Drips.
 **Key UX:** Select playbook → Auto-load thresholds/rules → Generate drips → Publish → Checklist complete.
 **Artifacts:** `playbooks.json` (preset scenarios).
 **Success:** One-sitting deployments with measurable appointment/reply deltas.

**Playbook spec (JSON)**

```json
{"id":"move_in_ready_push","name":"Move-In Ready Push","presetScenario":"inventory_focus","thresholds":{"return_visit_7d":2,"zoom_lot":2},"sequenceTemplate":"inventory_clearance_v1","kpiTargets":{"appointments":"+15%","reply_rate":"+20%"}}
```

------

## **Feature ↔ Concept Mapping**

| **eBook Concept**        | **Module(s)**        | **Primary Proof**              | **Leading KPIs**                       | **Export**                |
| ------------------------ | -------------------- | ------------------------------ | -------------------------------------- | ------------------------- |
| Aiglish™ (22 terms)      | Glossary Lab         | Quiz + “one action today”      | Term mastery %, time/term              | —                         |
| AI Frame / AIO           | Frame Builder, Audit | Heatmap, Checklist, Score      | +Schema coverage, +Canonicalization    | `sigframe_checklist.json` |
| AI Sales Flow™           | Simulator            | Event Timeline + Why-Fired     | +Signal Lock/Commitment deltas         | `flow_rules.yaml`         |
| MarvelBot™               | Bot Studio           | A/B transcripts, handoff logs  | +Appt rate from chat; ↓time-to-handoff | `bot_package.json`        |
| Lead Scoring             | Scoring Workbench    | Score distribution; cohort sim | +AAA/A surfaced                        | `score_config.yaml`       |
| Scripts & Drips          | Generator            | Sequence JSON → publish        | +Reply rate; +Bookings                 | `sequence.json`           |
| AI Visibility            | Audit                | Score dial + Fix list          | +Visibility score; fix completion      | `audit_report.json`       |
| Signal Lock / Commitment | Simulator            | KPI deltas panel               | Target deltas per scenario             | In sim report             |

------

## **Information Architecture**

- **Home:** Tiles for all modules.
- **Dashboard:** Status summaries and recent artifacts.
- **Module pages:** Dedicated workspaces.
- **API:** `/api/ingest`, `/api/audit`, `/api/simulate`, `/api/generate`.

------

## **Core Data Model (Types)**

- In `lib/types.ts`: `Term`, `BuyerEvent`, `AutomationFire`, `Step`, `FixItem`, enums for event types and fix categories.
- Extensible via JSON/YAML configs in `/data`.

------

## **API Contracts (as shipped)**

- **POST `/api/ingest`** → `{ urlCount:number, entitiesDetected:string[] }`
- **POST `/api/audit`** → `{ score:number, fixes:FixItem[], metrics:any }`
- **POST `/api/simulate`** → `{ fires:AutomationFire[], kpis:any }`
- **POST `/api/generate`** → `{ result:any }` (wire to Claude for real output)

------

## **Integrations (designed, not enforced)**

- **Claude Code:** Use prompt kits in `lib/prompts/*`. Paste outputs into `/data` or POST to `/api/generate`.
- **CRM/Email/SMS:** Export JSON/CSV/HTML; map to SendGrid/Twilio later.
- **Project tools:** Export SigFrame checklist to Jira/Linear via simple webhook.

------

## **Non-Functional Requirements**

- **Performance:** Sub-second UI interactions on module UIs; audit demo completes under a few minutes for small sites.
- **Reliability:** Deterministic rule engine; JSON/YAML validation before publish.
- **Accessibility:** Keyboard navigable; sufficient contrast; semantic headings.
- **DX:** Clear folder structure; pure-TS engines; prompt kits ready for Claude.

------

## **Security & Privacy**

- No PII persistence by default.
- Client-provided content stays local unless explicitly exported.
- Add env-based secrets only when wiring external endpoints.

------

## **Analytics (suggested PostHog events)**

- `term_viewed`, `term_quiz_passed`
- `audit_run`, `audit_fix_exported`
- `sim_run`, `sim_fire_inspected`
- `drip_generated`, `drip_published`
- `bot_ab_test_run`, `bot_exported`

**North-Star (leading)**

- Term mastery %, Fix completion %, AAA/A leads surfaced, Reply rate, Appointments from chat.

------



------

## **Open Questions**

- Which CRM(s) to target first for export mapping?
- Preferred schema flavors (JSON-LD types) per entity?
- Minimum viable set of playbooks for initial adoption?

------

## **Acceptance Criteria**

- **Glossary:** All 22 terms render; quiz & “one action” save works.
- **Frame Builder:** Upload sitemap → detect entities & drift → export checklist.
- **Simulator:** Preset events fire at least one rule; explanations visible; KPI deltas shown.
- **Drips:** Generate valid `sequence.json`; token validation; CSV/HTML export available.
- **Audit:** Score + ≥10 actionable fixes with categories/impact/steps.
- **Bot Studio:** Can import FAQs, set handoff rules, export `bot_package.json`.
- **Scoring:** Adjust weights → live distribution changes → export `score_config.yaml`.
- **Playbooks:** Selecting a playbook auto-configures Simulator + Drips.

------

### **Call-to-Action**

- Open the scaffold, run `npm i && npm run dev`, and start with **Glossary → Drips → Simulator**.
- When you’re ready, I can **add Zod validators + CSV/HTML exports + Jira webhook** to harden the pipeline.