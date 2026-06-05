# Project Checkpoint

Last updated: 2026-06-04

## Current Status

- App: Article Tutor, an English reading tool for Chinese-native elementary and middle-school learners.
- Stack: Next.js 14 App Router, TypeScript, Tailwind CSS.
- Deployment model: fully static export via `output: "export"` in `next.config.mjs`.
- Persistence: browser `localStorage` only.
- No backend, database, auth, API routes, middleware, or server runtime.
- Main features: topic cards, article reader, word and sentence lookup, saved vocabulary list, Web Speech API read-aloud, and Challenge UI.
- Challenge UI now supports randomized 3-question attempts with recent-question avoidance and grammar-style question types when available.
- Current human instruction wins over standing docs for the active session; otherwise future AI sessions should use `AGENTS.md` and this checkpoint as their starting guidance.
- Human approval is required before commit, push, or deploy.

## Last Completed Change

- Added two grammar-style Challenge questions (tense + singular/plural) to the `healthy-day` article in `lib/mockData.ts`. Content-only change; no app behavior, config, or dependencies changed. Verified with `npx tsc --noEmit` and `npm run build` (both pass); `npm run lint` skipped (see Known Issues).
- v0.3.1 added grammar-style question types, per-attempt random selection, attempt persistence by question id, recent-question history, step dots, subtle quiz animation, and seed grammar questions for three articles.
- Current scaffold adds documentation for AI-agent workflow, review gating, project checkpointing, and lightweight task tracking.

## Known Issues

- Grammar-style questions are seeded for 4 of 8 articles (`first-day`, `elephant-nose`, `why-seasons`, `healthy-day`); the remaining articles backfill attempts from available question types until they get grammar content.
- `npm run lint` is not configured: `next lint` drops into an interactive ESLint setup prompt and exits non-zero. Treat it as unavailable until ESLint is set up (a config/dependency change requiring explicit approval); use `npx tsc --noEmit` and `npm run build` as the working checks.
- Vocabulary auto-save on wrong quiz answers is planned but not implemented.
- TTS depends on browser Web Speech API support and may not work on all devices.
- The content set is small and should keep following the public-content copyright rule.

## Next Small Tasks

- Add grammar-style Challenge questions to the remaining articles (`favorite-festival`, `olympic-games`, `young-inventor`, `robots-help`), one or two articles per round.
- Add focused review prompts for new learner-facing content before merging.
- Improve Challenge-to-vocabulary flow, such as saving missed vocabulary questions, in a separate scoped round.
- Add a minimal manual QA checklist for mobile reading, quiz, and TTS behavior.

## Verification Commands

Use the existing commands before claiming code changes are complete:

```bash
npx tsc --noEmit
npm run build
npm run lint
```

For docs-only changes, at minimum inspect the changed files and run:

```bash
git diff --check
git status --short
```

Never mark a task complete just because code or docs were generated. Always report verification status and any review status or skipped checks.
