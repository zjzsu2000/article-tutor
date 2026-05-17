# Product feedback and roadmap — 2026-05-16

A snapshot of the project after v0.2 (TTS) was tested on real devices, plus
the agreed roadmap and principles going forward. Written for future
contributors and AI coding assistants picking up the codebase.

---

## 1. Project shape

This repo is the **main reading app**: a Next.js + Tailwind tool with static
export, targeting Chinese-native school-age learners (elementary / middle
school). Core experience: topic-based article reading with tap-a-word lookup,
tap-a-sentence translation + grammar, read-aloud, and (next) a light
post-reading quest.

A separate **HTML sandbox** lives in a different repo, used for rapid
ideation: a single-page tool for hand-entering vocabulary, examples, and
quick experiments. Anything mentioned about the sandbox in this note is for
context only — implementation of sandbox features happens in the other repo.

### What is shipped in the main reading app

- Topic-based article reading
- Click word → definition, IPA, example
- Click sentence → Chinese translation, grammar notes
- TTS: read aloud full article / sentence / word
- Slowed default speech rate
- Per-article quiz data structure (3 question types): vocabulary, detail,
  main idea (the `quiz` field on `Article` in `lib/types.ts`)
- Challenge UI (闯关测试) on top of that data is **not yet** implemented

The questions the main app is meant to answer through real-device testing:

> Will a young learner choose to read? Can they understand what they read?
> Do tap-word and tap-sentence help comprehension? Does read-aloud improve
> understanding?

---

## 2. Real-device feedback

### 2.1 Browser compatibility on China / HarmonyOS tablets

Tested on a HarmonyOS tablet across the built-in browser and several common
third-party Chinese browsers. Observation: most of these browsers do not
show the read-aloud button.

Diagnosis: **some China / HarmonyOS tablet browsers do not expose the Web
Speech API (`window.speechSynthesis`), so TTS buttons may not appear.**
The rest of the app (reading, word lookup, sentence explanation) is
unaffected — it is purely a TTS-availability issue.

A Chromium-based browser inside one cross-border utility app did work, but
that app is unreliable as a long-term recommendation.

Handling principles:

- Do not write per-browser hacks.
- When `speechSynthesis` is unavailable, show a friendly notice instead of
  letting the read-aloud button vanish silently.
- Confirm to the user that reading, word lookup, and sentence explanation
  still work.

Notice text (shipped in v0.2):

- zh: 当前浏览器暂不支持朗读功能，可以换其他浏览器或设备试试。阅读、点词和点句子功能仍可正常使用。
- en: Speech is not supported in this browser. You can try another browser or device. Reading, word lookup, and sentence explanation still work.

### 2.2 TTS rough edges in the v0.2 first cut

Priority: high. Three issues from real use:

1. **The "unsupported" fallback was invisible.** The read-aloud button just
   vanished and confused users.
2. **No pause / resume.** Only Stop existed. Learners want to pause briefly
   to follow along.
3. **Sentence switching could get stuck.** Tapping a new sentence before
   the previous utterance finished could leave the speech engine in a bad
   state, the button frozen, or the highlight on the wrong sentence.

Expected behaviour after the fix:

- Only one utterance plays at a time.
- A new tap cleanly cancels the previous utterance.
- No stuck "speaking" state.
- The full-article highlight clears or moves correctly on interruption.

Notes:

- Pause / resume depends on each browser's implementation of
  `speechSynthesis.pause()` / `resume()`. Mobile and Chinese-vendor
  browsers behave unevenly.
- Where pause / resume is unreliable, degrade gracefully to Stop /
  Re-start instead of pretending it worked.

All three points are addressed in the v0.2 shipped fix. The
sentence-switching robustness change uses a common practical workaround
for Chromium-family `speechSynthesis` timing issues: insert a short delay
between `cancel()` and the next `speak()`, and `resume()` before `cancel()`
when the engine was paused.

---

## 3. Content strategy

### 3.1 Content matters more than the feature stack

A reading product cannot win on features alone. What actually decides
whether a young learner keeps reading:

- Is the difficulty right?
- Is the vocabulary age-appropriate?
- Is the article interesting?
- Do the questions actually check comprehension?
- Will the learner pick it up again tomorrow?

### 3.2 Copyright policy for public content

This is a public GitHub repo with a public deployment.

- **Do not paste copyrighted modern works** — popular modern novels,
  textbook excerpts, etc. — into the article seed.
- Private local-only testing with copyrighted material is a learner's own
  choice, but **must never end up in the public repo, in a public
  deployment, or in published demos**. Avoids takedown risk and account
  suspension.

Public content should come from:

- Original prose written for this project (the current 8 seed articles are
  this).
- Public-domain works.
- Graded retellings inspired by public-domain works.
- Original AI-generated stories (with human review).

### 3.3 Public-domain content directions by reading level

Lower elementary

- Aesop's Fables
- Grimm's Fairy Tales
- Andersen's Fairy Tales
- The Tale of Peter Rabbit
- The Wonderful Wizard of Oz
- Alice's Adventures in Wonderland

Upper elementary / middle school

- The Secret Garden
- The Adventures of Tom Sawyer
- Black Beauty
- Treasure Island
- Robinson Crusoe

Higher

- Little Women
- A Christmas Carol
- Sherlock Holmes stories
- Pride and Prejudice
- Jane Eyre

Note: even public-domain works should be **graded down to the learner's
reading level** rather than pasted in whole.

### 3.4 First batch of upper-elementary samples (suggested)

Recommended new articles, each around 120–180 words, 6–8 clear sentences,
with Chinese translation per sentence, simple grammar notes, key
vocabulary, and a 3-question quiz:

1. *The Honest Woodcutter* — Aesop / honesty theme
2. *The Clever Fox and the Crow* — Aesop / "don't trust flattery"
3. *Alice Finds a Small Door* — Alice in Wonderland inspired
4. *Dorothy Meets the Scarecrow* — Wizard of Oz inspired

Quiz naming convention (kid-friendly, used per article):

- Q1: 单词小侦探 / "Word Detective" — vocabulary
- Q2: 细节小达人 / "Detail Expert" — detail comprehension
- Q3: 主旨小队长 / "Main Idea Captain" — main idea

---

## 4. Long-term: paste or photo import

A future workflow: a parent or learner brings their own English passage and
the system generates the learning material around it.

Phased rollout:

### Phase 1 — paste-text import

- Input: plain English text
- Output: sentence split, Chinese translations, key vocabulary,
  definitions, examples, grammar notes, quiz

Why first: low technical risk, no OCR errors, validates the whole flow end
to end.

### Phase 2 — image upload + OCR

```
image
  → OCR
  → text cleanup
  → sentence split
  → difficulty estimate
  → key word extraction
  → translations
  → grammar notes
  → quiz
```

### Phase 3 — review before publishing

Imported material **should not** go straight into the public content
library.

```
imported article
  → AI generates learning material
  → reviewer (parent / teacher) checks
  → learner tries it
  → good content is promoted to the formal library
```

---

## 5. Vocabulary library direction

### 5.1 For now

No need for a huge vocabulary database. Target instead:

- Every key word in the current article has a real dictionary entry.
- 8–12 core words per article.
- Common content words don't repeatedly fall through to "no entry yet".

### 5.2 Later

Layered by level:

- Elementary core
- Elementary extended
- Middle school
- KET-level
- PET-level

Per-word fields can grow over time:

```
word
phonetic
partOfSpeech
chineseMeaning
englishDefinition
exampleSentence
exampleSentenceTranslation
level
tags
relatedPhrases
```

### 5.3 AI assist with human review

- AI proposes keyword lists and definitions.
- A teaching-side reviewer adjusts difficulty and accuracy.
- An engineering-side reviewer owns the data shape.
- The learner flags words that are still confusing.

---

## 6. Roles

Three complementary perspectives. Keep them distinct.

### Learner

- Picks topics and themes of interest
- Tries the site on real devices
- Reports what's fun, what's confusing
- Decides whether they keep coming back
- May later co-author content in the creative sandbox

### Parent or teacher reviewer (content / pedagogy)

- Judges whether material is age-appropriate
- Owns difficulty grading
- Curates vocabulary tier
- Decides what each question is meant to check
- Final signal on learning effect

### Engineer

- Owns architecture, AI-assisted implementation, repo, deployment
- Translates feedback into actionable, scoped tasks
- Owns data schema decisions

---

## 7. AI-assisted development flow

```
clarify need + boundaries
  → hand off to an AI coding tool
  → AI reports change summary + tests
  → human or another AI reviews
  → commit
  → deploy
  → real-device testing
  → collect feedback
  → iterate
```

Practice notes:

- Use one AI for the primary change and (optionally) a different AI for
  review on a separate task.
- The main app deploys to push-based static hosts (e.g. Vercel auto-deploys
  on push).
- A second static host (e.g. Cloudflare Pages) is also in use; if set up in
  Direct Upload mode it requires a manual deploy step rather than auto on
  push.
- No secrets belong in the repo — use the host's own secrets management.

---

## 8. Suggested roadmap

> **Content-source note that applies across all rounds:** any reading
> material added to the public deployment should be **original prose or
> public-domain-inspired adapted stories**. Copyrighted modern book
> excerpts (popular novels, current textbooks, etc.) must not appear in
> public demos or in the seed content, regardless of how they are sourced.

### v0.2.x — TTS stabilization (shipped or in progress)

- Friendly unsupported-browser notice
- Fix sentence-switching getting stuck
- Pause / resume
- Slightly more discoverable per-sentence read button
- Continued rate tuning (current default `0.7`)

### v0.3 — Challenge UI (闯关测试)

- 3 questions appear below each article
- Progressive single-question reveal (one at a time)
- Immediate per-answer feedback (explanation on wrong)
- Not exam-styled, no leaderboard
- Light, encouraging tone

Kid-facing naming:

- Overall: 闯关测试 / "Challenge"
- Q1: 单词小侦探 / "Word Detective"
- Q2: 细节小达人 / "Detail Expert"
- Q3: 主旨小队长 / "Main Idea Captain"

### v0.4 — Creative sandbox capabilities

- Add custom topics, articles, key words
- Add example sentences with Chinese translation
- Preview page
- Edit / delete content
- Bulk word entry, e.g.
  ```
  word | meaning | English example | example translation
  ```

(Implementation of this lives in the sandbox repo, not here; the main app
only needs to be ready to consume content that graduates from sandbox to
formal library.)

### v0.5 — Article import

- Phase 1: paste English text → AI generates learning material
- Phase 2: image upload + OCR (later)
- Phase 3: reviewer approval before promoting to formal library

### v0.6 — Local learning records

- Article completion state
- Quiz completion state
- Vocabulary review state

All client-side in `localStorage`. No backend required.

---

## 9. Development principles

1. **Small and focused.** Each round fixes one or two real pain points,
   not a feature batch.
2. **Real-user signal first.** Whether a young learner keeps coming back
   matters more than the feature checklist.
3. **Separate the formal app from the sandbox.** The main reading app
   stays clean, stable, and learnable. The sandbox is allowed to experiment
   quickly. The sandbox is in a separate repo.
4. **Content quality leads.** Tech is the support; content choice decides
   whether learning actually happens.
5. **Copyright-safe in public.** Public demos do not include large chunks
   of modern copyrighted text. Prefer original, public-domain, licensed, or
   graded-retold material.
6. **Static export is a hard constraint.** Keep `output: "export"`
   working. No middleware, no API routes, no server runtime.
7. **AI assists, humans decide.** AI can generate code and content. Product
   direction, pedagogical quality, and release decisions stay with the
   human team.

---

## 10. Current task split (main reading app)

### Done / in progress

- TTS fixes in this round: unsupported-fallback notice,
  sentence-switching robustness, pause / resume, slower default rate.
  Shipped in v0.2.
- Quiz data structure populated for all 8 seed articles.

### Next (priority order — close the learning loop first)

1. **Challenge UI / 闯关测试** (v0.3) — data is ready in
   `Article.quiz?: Question[]`; UI mounts under the reader. Progressive
   single-question reveal. Store progress in `localStorage`. This is the
   loop-closing piece: read → tap to understand → answer → know they got
   it.
2. **Challenge × vocabulary linking** — when a vocabulary question is
   answered wrong, auto-save the related word into the learner's
   vocabulary list (with `isSaved` check to avoid duplicates). Tightens
   the read → answer → review feedback.
3. **TTS compatibility + minimal settings UI** — continue widening the
   set of browsers where TTS is usable; add a small gear icon → slow /
   normal / fast + voice picker. Persist in `localStorage`. Defaults stay
   at `0.7` and the first preferred en-US voice.
4. **One-to-many topic → articles** (`Topic.articleId: string` →
   `articleIds: string[]`) once content expansion starts.
5. **Public-domain-inspired article batch** — start with the four
   upper-elementary samples listed above. Original or public-domain-
   adapted only; no copyrighted modern excerpts in public demos.

### Out of scope (for now)

- Backend, database, server auth
- Paid external TTS / AI APIs in the public deployment
- Scored leaderboards, forced ordering, time-limit "tests"
- Optional future side branch (adult / workplace English) belongs in its
  own repo and its own brand, not a refactor of the main app.

---

## 11. Short-term suggested order

1. Finish the main app's TTS fixes (this round).
2. Redeploy and let a real young learner re-test.
3. If the experience holds up, proceed to v0.3 Quiz UI.
4. Add one or two public-domain-inspired upper-elementary articles in the
   next content round.

Do not push more than one major feature per round.

The core test that matters:

> The learner is willing to read, can listen, can tap words and sentences,
> and finishes a light quest knowing they understood the article.
