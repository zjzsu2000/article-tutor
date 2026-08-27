# Changelog

All notable changes to this project are documented in this file.

Format inspired by [Keep a Changelog](https://keepachangelog.com/).
Versions are tagged informally — this is a small student-focused MVP, not
a SemVer-strict library.

---

## [Unreleased]

Implemented in the working tree; not reviewed, released, or deployed.

### Added

- **My own Chinese meaning for any vocabulary item.** A learner can write, edit,
  or clear their own meaning from the reading panel or the vocabulary notebook.
  It is stored separately (`userTranslation`) from the dictionary's meaning, and
  is preferred wherever a meaning is shown or practised.
- **Phrases as first-class vocabulary.** Tap a word, then extend or shrink
  either edge one word at a time (or reset it) to select a phrase. Phrases
  save, group, display, and drill exactly like single words, carry an explicit
  `kind`, and can be collected with only a learner-written meaning when the
  dictionary has no entry. The panel also glosses a phrase word by word.
- **Dictation board** (`/[locale]/dictation`): a Chinese meaning is shown and
  the learner types the English word or phrase. Answers are compared
  case-, spacing-, and punctuation-insensitively; the correct spelling is
  revealed with read-aloud, weaker items come up first, and a round can be
  repeated over just the missed items.
- **My Articles** (`/[locale]/my`): paste a title and an English passage to read
  it with the normal reader — tap-a-word, phrase selection, and read-aloud all
  work. Saved in this browser only; no translations, grammar notes, or quiz yet.

### Changed

- The vocabulary dedupe key is whitespace-normalized as well as lowercased
  (unchanged behaviour for single words, needed for phrases).
- `Article.level` is optional: an article a learner pasted in shows no level
  chip instead of an invented one, and empty sentence translation/grammar
  fields are omitted from the panel rather than rendered blank.
- The navbar uses a two-row mobile layout so Topics, Vocabulary, Dictation,
  and the language switcher remain reachable without horizontal overflow.

---

## [v0.3.1] — 2026-06-04

### Added

- **Grammar-style question types**: `grammar`, `tense`, `singular_plural`,
  and `comparative` join `vocabulary` / `detail` / `main_idea`. Each has a
  kid-friendly name (e.g. 时态小专家 / Tense Detective, 比较级小高手 /
  Compare Champ). Articles do **not** need every type.
- **Per-attempt random question selection** (`lib/quiz.ts`): each Challenge
  attempt draws a small set — one vocabulary, one comprehension
  (detail / main idea), one grammar-group question — picking randomly when
  a group has several, and backfilling to keep three when a group is empty
  (so existing articles are not shortened).
- **Recent-question avoidance**: recently shown question ids are remembered
  per article (`english_study.quizHistory`) and de-prioritized on the next
  attempt, with graceful fallback when a group is small.
- **Seed grammar questions** added to three articles (first day at school,
  the elephant's trunk, why we have seasons) to demonstrate the new types.
- **Light interactivity**: a step-dot progress indicator, a subtle
  entrance animation on feedback and the result card (respecting
  `prefers-reduced-motion`), and a small celebration mark on completion.
  No audio added.

### Changed

- The Challenge now resumes the **exact same attempt** after a reload: the
  selected question ids and answers are stored together
  (`english_study.quizProgress` now holds `{ questionIds, answers }`).
  Older progress without `questionIds` is treated as stale and a fresh
  attempt is generated. "Try again" now produces a new random set.

---

## [v0.3] — 2026-05-28

### Added

- **Challenge UI / 闯关测试**: the per-article quiz data shipped in v0.2 now
  has a kid-friendly interface below the article reader.
  - Progressive single-question reveal (one question at a time).
  - Immediate per-answer feedback: the correct option turns green, a wrong
    pick turns red, and the question's explanation shows as a hint.
  - Kid-facing question names by type: 单词小侦探 / Word Detective
    (vocabulary), 细节小达人 / Detail Expert (detail), 主旨小队长 / Main
    Idea Captain (main idea).
  - Encouraging result card with the score and a "try again" reset. No
    leaderboard, no timer, no forced ordering.
- **Quiz progress in `localStorage`** (`english_study.quizProgress`, keyed
  per article): answered questions and the current position are restored
  when the learner reopens an article.

---

## [v0.2] — 2026-05-16

### Added

- **TTS read-aloud** via the Web Speech API:
  - Read the full article (sentence by sentence)
  - Read a single selected sentence
  - Read a single tapped word
- **Pause / Resume / Stop** controls for full-article playback.
- **Sentence-level highlight** while the full article is reading.
- **Friendly unsupported-browser notice** in place of the read-aloud
  button when `window.speechSynthesis` is not available (e.g. on some
  China / HarmonyOS tablet browsers). Reading, word lookup, and sentence
  explanation remain fully usable on those browsers.
- **Per-article quiz data structure**: three questions per article
  (vocabulary, detail, main idea), exposed as the optional `quiz` field
  on `Article` in `lib/types.ts`. The UI on top of this data is planned
  for v0.3 (Challenge UI / 闯关测试).

### Changed

- **Default TTS speech rate slowed to `0.7`** based on real-device
  feedback from young learners (originally `0.9`, briefly `0.8`).
- **Robust speech switching**: tapping a new word or sentence while
  another utterance is playing cleanly cancels the old one and starts
  the new one without leaving the engine in a stuck state.
- **Sentence highlight clears correctly on interruption** when another
  component takes over the TTS engine.

### Fixed

- Some Chromium-family browsers (including those on HarmonyOS) could
  drop the next utterance when `speak()` was called immediately after
  `cancel()`. Mitigated with a short settle delay between cancel and the
  next speak, and a defensive `resume()` before `cancel()` when the
  engine was paused.

---

## [v0.1] — initial MVP

### Added

- Topic cards on the home page (eight student-friendly topics).
- Article reader with sentence-by-sentence layout.
- Word lookup: tap a word for English definition, Chinese meaning, IPA,
  and example sentence.
- Sentence explanation: tap a sentence for the Chinese translation and a
  simple grammar note.
- Personal vocabulary list, stored in `localStorage` per device.
- Static export via Next.js `output: "export"`; deployable to any static
  host with no backend.
