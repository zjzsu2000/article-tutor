# Project Checkpoint

Last updated: 2026-07-12

State: Phase 1 question-bank expansion committed and pushed (this commit). Codex review: round 1 found 4 blockers (fixed in a blocker-only pass), round 2 approved with 4 minor findings deferred by agreement (review packages in `/tmp/question-bank-review/`). Vercel auto-deploys from this push; the Cloudflare Pages mirror still needs a manual redeploy (approval pending).

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
- After any non-trivial user-visible or code-logic change, the Builder must automatically prepare a task-specific `/tmp/<task-name>-review/` Codex review package before asking for commit approval.
- Codex review output should be saved to `/tmp/<task-name>-review/CODEX_REVIEW.md`; the Builder should read that file and extract the `Builder Follow-up Prompt` automatically instead of requiring human copy/paste.

## Last Completed Change

- **Phase 1 question-bank expansion (content-only; Codex round 2 approved — 4 round-1 blockers fixed: young-inventor q8 no longer implies 'see + object + verb-ing' is ungrammatical, weekly-2 q9 no longer marks informal 'was' after 'as if' as categorically wrong, weekly-1 q8's correct option restored to the faithful "helps anyone who asks", roadmap Phase 1 description aligned with the delivered counts/English explanations; 4 minor findings deferred: correct-answer position bias, 'every always' wording, patients/athletes explanation precision)**: every article now has exactly 9 Challenge questions — 3 vocabulary, 3 comprehension (detail/main_idea), 3 grammar-group (grammar/tense/singular_plural/comparative) — so random 3-question attempts stay fresh and every attempt can include a grammar question. The four thin articles (`favorite-festival`, `olympic-games`, `young-inventor`, `robots-help`) went from 3 to 9 questions (previously no grammar questions at all); the rest were topped up from 5–6 to 9. New optional `Question.word` field in `lib/types.ts` (dictionary key of the word a vocabulary question tests, must resolve via `lookupWord`) — inert for the current UI, filled on all 33 vocabulary questions to enable a future "auto-save missed words to the notebook" feature. Correct-answer option positions were deliberately varied in new questions because options are not shuffled at render time. Verified: `npx tsc --noEmit` and `npm run build` pass (30 pages, 22 article paths unchanged); a one-off validation script confirmed per-article 3/3/3 group counts, unique ids, `correctAnswer ∈ options`, 4 options each, no duplicate options, and that every `word` value resolves in a dictionary. `npm run lint` skipped (unconfigured). Files: `lib/mockData.ts`, `lib/types.ts`. No CHANGELOG entry (content-only precedent: the earlier healthy-day grammar questions were checkpoint-only).
- **Roadmap draft (docs-only): `docs/plans/2026-07-10_content_and_turso_roadmap.md`** — a phased plan covering (1) this question-bank expansion, (2) Weekly Stories weeks 4–9, (3) a Turso-backed user database (nickname + 4-digit-PIN profiles, per-user vocabulary notebook, challenge-attempt records with answer/explanation snapshots, a 错题本/history page), and (4) client integration. **Status: the owner approved Phase 1 only.** Phases 2–4 are drafted but NOT approved for implementation — the static-export constraint (`output: "export"`), no-new-dependencies rule, and no-backend rule all remain in force until the owner opens a separate implementation round.
- Vocabulary notebook UX + data organization (`fix(vocabulary): add safer delete and weekly grouping`, commit `c89326b`): (1) single delete moved to its own bottom row, danger-styled, gated behind a confirmation dialog, with read-aloud kept as a top-right icon button; (2) new selection mode with checkboxes + a batch-delete action bar (clear selection / delete selected / done), batch delete behind a counted confirmation; (3) saved words now group/filter by source — Weekly Stories week, source article, or "Uncategorized / 未分类" — via new optional `WordSource` metadata (`articleId`, `articleTitle`, `track`, `weekNumber`, `sourceLabel`) captured at save time through `ArticleReader` → `InfoPanel` → `saveWord`; (4) device-only note added ("生词仅保存在当前设备和浏览器。 / Vocabulary is saved only on this device and browser."). `lib/storage.ts` gains `removeWords()` batch delete and a defensive `normalizeSavedWord` load migration so legacy entries (missing `savedAt` / source fields) stay visible. Two Codex round-1 blockers fixed: selection clears on filter change so batch delete can't remove hidden words, and `groupKeyOf` prefers explicit `weekNumber` → `articleId` → `sourceWeek` (legacy fallback only) so non-weekly saves group by their real article. Files: `components/VocabularyClient.tsx`, `components/InfoPanel.tsx`, `components/ArticleReader.tsx`, `lib/storage.ts`, `lib/types.ts`, `lib/i18n.ts`. No backend/API/deps; static export intact; `tsc` + `build` pass; `npm run lint` skipped (unconfigured). Review package in `/tmp/vocabulary-notebook-review/`.
- Docs-only workflow update: review packages now persist the full Codex review output to `CODEX_REVIEW.md` in the task-specific `/tmp/<task-name>-review/` directory. The ready-to-run Codex command template uses `tee`, and Builders are expected to read `CODEX_REVIEW.md` and extract the `Builder Follow-up Prompt` automatically for the next implementation pass.
- Docs-only workflow update: `AGENTS.md`, `docs/agent-loop.md`, and `docs/review-checklist.md` now require Builders to automatically create a review package after non-trivial user-visible or code-logic changes. Packages live under `/tmp/<task-name>-review/` (for vocabulary notebook work: `/tmp/vocabulary-notebook-review/`) and include `REVIEW.md`, `changes.patch`, plus `FIX_SUMMARY.md` when useful. `changes.patch` must include untracked files via `git add -N`, and the Builder must print an exact Codex Reviewer command. The no-commit/no-push/no-deploy human gate remains in force.
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
- `npm run lint` is not configured: `next lint` drops into an interactive ESLint setup prompt and exits non-zero. Treat it as unavailable until ESLint is set up (a config/dependency change requiring explicit approval); use `npx tsc --noEmit` and `npm run build` as the working checks.
- Vocabulary auto-save on wrong quiz answers is planned but not implemented.
- TTS depends on browser Web Speech API support and may not work on all devices.
- The content set is small and should keep following the public-content copyright rule.

## Next Small Tasks

- Run the Cloudflare manual redeploy for the question-bank expansion once approved.
- Address the 4 deferred minor review findings from `/tmp/question-bank-review/CODEX_REVIEW.md` in a small follow-up round (spread correct-answer positions, soften the 'every is always' explanation, align the patients/athletes explanations with their options).
- Integrate the next Weekly Stories batch (weeks 4–9 approved as scope in the roadmap draft, pending a separate owner go-ahead per round), one to three per round, using the adaptation rules in `docs/content-plans/2026-06-04-weekly-stories-track.md`.
- Before any commit, inspect `git status --short` and stage only files that belong to the chosen task.
- Real-device QA of the reader bugfixes (pause/resume, sticky panel, panel-follow during reading) on China / HarmonyOS browsers, then run the Cloudflare manual redeploy.
- Add focused review prompts for new learner-facing content before merging.
- Improve Challenge-to-vocabulary flow, such as saving missed vocabulary questions, in a separate scoped round.
- Add a minimal manual QA checklist for mobile reading, quiz, and TTS behavior.

## Co-Creation Notes (preserve)

- The 18-week Weekly Stories track is the learner's (the user's son's) main curriculum; he is learner + co-author. Keep tone encouraging, age-appropriate, never exam-like.
- Parent/teacher reviewer owns content/pedagogy quality — use the review checklist in `docs/content-plans/2026-06-04-weekly-stories-track.md` (translations, grammar notes, quiz answers, age fit, copyright-safe).
- The separate Vocabulary Practice Sandbox (HTML repo) is the design lab for learner-authored words/examples; proven ideas graduate into this app as React components — do not copy single-file HTML in.
- Learner flags confusing words → feeds dictionary coverage; missed quiz vocabulary → future auto-save into the vocab list.
- Source for new weeks: `/Users/zhzja/code/english_learning_notes/每周一个小故事.docx` (family study doc, copyright-uncertain — retell in original words, never paste).

## To Resume

```bash
cd /Users/zhzja/code/english_study
git status                         # main is 1 commit ahead of origin (c89326b)
npx tsc --noEmit && npm run build  # working checks (npm run lint is unconfigured)
# Cloudflare mirror (manual, when ready):
npm run build && npx wrangler pages deploy out --project-name english-study --branch main
```

Workflow: build the smallest diff → prepare a `/tmp/<task>-review/` package → Codex review → human gate before any commit/push/deploy.

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
