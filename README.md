# HomebuilderAI Interactive — Next.js Scaffold

A Claude/Cursor-friendly starter to build an interactive lab for Aiglish™, AI Frames, and the AI Sales Flow™.

## Quickstart
```bash
pnpm i # or npm i / yarn
pnpm dev # http://localhost:3000
```
> Uses Next 14 + Tailwind. No DB required for the demo.

## What’s inside
- `/app` — Next App Router pages
- `/app/api` — stub endpoints: `ingest`, `audit`, `simulate`, `generate`
- `/packages/core` — pure TypeScript engines (flow, audit, scoring)
- `/lib` — types, starter rules, weights, entity config, and prompt kits
- `/data` — seed JSON/YAML (terms, rules, weights)

## Claude Code: drop-in prompts
- `lib/prompts/term_explainer.txt`
- `lib/prompts/drips.txt`
- `lib/prompts/bot_train.txt`

Paste a prompt into Claude, then paste JSON results into the UI or wire to `/api/generate`.

## Next steps
- Replace stub logic in `/packages/core/audit-engine` with a real crawler
- Build editors for: rules (YAML), sequences (JSON), intents (JSON)
- Add Zod validation before publishing sequences and configs
- Wire `/api/generate` to your Claude endpoint (via serverless function)
