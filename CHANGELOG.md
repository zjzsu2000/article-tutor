# Changelog

All notable changes to this project are documented in this file.

Format inspired by [Keep a Changelog](https://keepachangelog.com/).
Versions are tagged informally — this is a small student-focused MVP, not
a SemVer-strict library.

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
