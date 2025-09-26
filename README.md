# HomebuilderAI Interactive Demo

A complete Next.js application showcasing interactive learning modules for Aiglish™, AI Frames, and the AI Sales Flow™. Built with Claude Code as proof of concept for Myers Barnes Associates.

## 🚀 Live Demo
- **Local Development**: `http://localhost:3002`
- **Features**: 8 complete modules with interactive components
- **Status**: Production-ready with TypeScript, ESLint compliant

## Quickstart
```bash
pnpm install
pnpm dev # starts on http://localhost:3002
pnpm build # production build
pnpm lint # code quality check
```

## ✨ Key Features
- **Responsive Design**: Apple iOS-inspired glass morphism UI
- **Theme System**: Dynamic dark/light mode switching
- **Mobile Restrictions**: Desktop-optimized experience
- **Interactive Learning**: 90-second explainers, quizzes, actionable steps
- **Real-time Simulation**: Buyer event timeline with automation triggers
- **AI Tools**: Visibility audit, lead scoring, content generation

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
