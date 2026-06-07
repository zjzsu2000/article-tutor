# Project Checkpoint

Last updated: 2026-06-06

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
- Codex/Reviewer outputs must include a ready-to-send `Builder follow-up prompt` after every review.

## Last Completed Change

- Docs-only workflow update: `AGENTS.md`, `docs/agent-loop.md`, and `docs/review-checklist.md` now require every Codex/Reviewer report to include a ready-to-send `Builder follow-up prompt`. The prompt must target blockers-only when blockers exist, specify minor findings to fix/defer when only minor issues remain, or state approval plus a recommended commit message when no edits are needed. It must also preserve the no-commit/no-push/no-deploy gate unless explicitly approved.
- Reading-experience bugfixes (no new content): (1) full-article TTS now speaks one sentence at a time (chained on `onend`) in `lib/tts.ts`, so resume continues from the paused sentence and falls back to restarting the current sentence when a browser's native resume is unreliable; (2) the side info panel is `lg:sticky` so it stays visible while scrolling on desktop/tablet (`components/InfoPanel.tsx`); (3) during full-article reading the panel auto-follows the current sentence's translation/grammar, with a manual tap taking over until the next sentence and the last sentence kept on stop (`components/ArticleReader.tsx`); (4) the missing-word fallback shows the read-aloud button again (button moved out of the pronunciation-only block in `InfoPanel`). Robust TTS switching and dictionary/weeklyDictionary behavior preserved; `tsc` + `build` pass.
- Improved word-lookup coverage for the Weekly Stories track: added a shared static `lib/weeklyDictionary.ts` (92 entries — Weeks 1–3 source word lists, facts only, no copied example sentences — plus ~18 curated common content/base words). `lookupWord` in `lib/mockData.ts` now checks the weekly dictionary then the global dictionary, each with light suffix normalization so inflected forms resolve (mistakes→mistake, lived→live, shoes→shoe, choices→choice, deserves→deserve, arranged→arrange). Uncovered words now show a friendly fallback ("这个词还没有收录，后面会补充。" / "This word is not in the dictionary yet."). `WordEntry` fields relaxed to optional (+`collocation`, `sourceWeek`); `InfoPanel`/`VocabularyClient` render optional fields conditionally; i18n adds `panel.collocation` and `panel.notInDict`. No backend/API/deps; static export intact; `tsc` + `build` pass.
- Added the Weekly Stories / 每周小故事 track: new optional `Article` fields (`track`, `weekNumber`, `chineseTitle`, `focus`) and a `WeeklyStory` index type in `lib/types.ts`; an 18-week `weeklyStories` index plus 3 fully integrated pilot articles (`weekly-1-friendship`, `weekly-2-stupid-mistake`, `weekly-3-digital-watch`) and their vocabulary in `lib/mockData.ts`; a `WeeklyStoryCard` and a home-page "每周小故事 / Weekly Stories" section; a small weekly badge in the article header; i18n strings. Stories are original graded retellings of the source doc (copyright-safe); see `docs/content-plans/2026-06-04-weekly-stories-track.md`. Weeks 4–18 show as "待上线 / coming soon" and create no routes. Verified: `npx tsc --noEmit` and `npm run build` pass (22 article paths = 11 articles × 2 locales); unfinished weeks generate no pages; existing articles still build.
- Added two grammar-style Challenge questions (tense + singular/plural) to the `healthy-day` article in `lib/mockData.ts`. Content-only change; no app behavior, config, or dependencies changed. Verified with `npx tsc --noEmit` and `npm run build` (both pass); `npm run lint` skipped (see Known Issues).
- v0.3.1 added grammar-style question types, per-attempt random selection, attempt persistence by question id, recent-question history, step dots, subtle quiz animation, and seed grammar questions for three articles.
- Current scaffold adds documentation for AI-agent workflow, review gating, project checkpointing, and lightweight task tracking.

## Known Issues

- Weekly Stories track: only weeks 1–3 are integrated; weeks 4–18 are "coming soon" and need original graded retellings + vocabulary + quiz before going live (see the content plan).
- Dictionary coverage: Weeks 1–3 vocabulary is in `lib/weeklyDictionary.ts`; Weeks 4–18 not yet imported. Lookup normalization is heuristic — irregular forms (e.g. `went`, `bought`, `swallowed`) and words absent from both dictionaries still show the friendly fallback. Function words (the/is/as) intentionally fall back.
- Grammar-style questions are seeded for 4 of 8 standalone topic articles (`first-day`, `elephant-nose`, `why-seasons`, `healthy-day`); the remaining articles backfill attempts from available question types until they get grammar content.
- `npm run lint` is not configured: `next lint` drops into an interactive ESLint setup prompt and exits non-zero. Treat it as unavailable until ESLint is set up (a config/dependency change requiring explicit approval); use `npx tsc --noEmit` and `npm run build` as the working checks.
- Vocabulary auto-save on wrong quiz answers is planned but not implemented.
- TTS depends on browser Web Speech API support and may not work on all devices.
- The content set is small and should keep following the public-content copyright rule.

## Next Small Tasks

- Integrate the next Weekly Stories batch (weeks 4–6), one to three per round, using the adaptation rules in `docs/content-plans/2026-06-04-weekly-stories-track.md`.
- Add grammar-style Challenge questions to the remaining topic articles (`favorite-festival`, `olympic-games`, `young-inventor`, `robots-help`), one or two articles per round.
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
