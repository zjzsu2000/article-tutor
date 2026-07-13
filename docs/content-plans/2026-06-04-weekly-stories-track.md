# Weekly Stories / 每周小故事 — content plan

Date: 2026-06-04 (last updated 2026-07-13)
Status: weeks 1–5 integrated (4–5 in review); weeks 6–18 listed as "coming soon".

## Purpose

A single ongoing learning track of 18 short English stories — one per week —
adapted into the existing reading app (reader, word lookup, TTS, Challenge).
Each week becomes one article/lesson with sentence-level Chinese
translation, short grammar notes, a small set of key vocabulary, and a
9-question Challenge bank (3 vocabulary / 3 comprehension / 3
grammar-group; each attempt draws 3 at random). The track runs from
week 1 through week 18.

The track surfaces on the home page as its own "每周小故事 / Weekly Stories"
section, above the existing topic cards. Existing topics and articles are
unchanged.

## The 18 weekly stories

| Week | English title | 中文 | Theme | Status |
|---|---|---|---|---|
| 1 | The Power of Friendship | 友谊的力量 | Friendship & persistence | ✅ integrated |
| 2 | A Stupid Mistake | 一个愚蠢的错误 | Caring for animals | ✅ integrated |
| 3 | A Digital Watch | 一块电子表 | Weather & technology | ✅ integrated |
| 4 | The Weather Must Be Crazy | 疯狂的天气 | Strange, changing weather | ✅ integrated |
| 5 | Boss Day | 老板日 | Jobs & roles | ✅ integrated |
| 6 | A Policeman and His Diving Coach | 警察和他的潜水教练 | Courage & rescue | ⏳ coming soon |
| 7 | A Cool Surprise Party | 酷酷的惊喜派对 | A surprise party | ⏳ coming soon |
| 8 | A Silly Behaviour | 一个犯傻的举动 | Honesty & reflection | ⏳ coming soon |
| 9 | The Journey to London | 伦敦之旅 | A journey to London | ⏳ coming soon |
| 10 | Transport | 交通方式 | Ways to get around | ⏳ coming soon |
| 11 | Approaching the Earth | 走近地球 | Space & the Earth | ⏳ coming soon |
| 12 | Let's Go to the Farm | 去农场吧 | A day at the farm | ⏳ coming soon |
| 13 | Take Good Care of Your Body! | 照顾好你的身体！ | Take care of your body | ⏳ coming soon |
| 14 | Sports Count a Lot | 运动很重要 | Why sports matter | ⏳ coming soon |
| 15 | Our Environment Matters | 环境很重要 | Our environment matters | ⏳ coming soon |
| 16 | Rubbish Sorting | 垃圾分类 | Sorting rubbish | ⏳ coming soon |
| 17 | Communication and Technology | 沟通与科技 | Communication & technology | ⏳ coming soon |
| 18 | Robots | 机器人 | Robots | ⏳ coming soon |

## Integrated weeks (1–5)

Fully integrated as articles (each now carries the standard 9-question
bank — 3 vocabulary / 3 comprehension / 3 grammar-group):

- `weekly-1-friendship` — The Power of Friendship
- `weekly-2-stupid-mistake` — A Stupid Mistake
- `weekly-3-digital-watch` — A Digital Watch
- `weekly-4-crazy-weather` — The Weather Must Be Crazy
- `weekly-5-boss-day` — Boss Day

Each carries the new optional `Article` fields: `track: "weekly-stories"`,
`weekNumber`, `chineseTitle`, and a bilingual `focus`.

## Adaptation rules (IMPORTANT — copyright)

This repo and its deployment are public. The source document
(每周一个小故事.docx) is study/exam-prep material of uncertain license, so
its prose is **not** copied verbatim.

- **Stories are original graded retellings.** Each pilot story is rewritten
  in original words at the learner's level, keeping the same plot, theme,
  and target vocabulary. This follows the project's public-content rule
  (original prose / graded retellings only) in README and the product
  roadmap (§3.2).
- **Vocabulary entries** reuse only dictionary-style facts from the source
  word list (word + IPA + part of speech + Chinese gloss + short
  collocation). Example sentences are intentionally omitted from the
  weekly dictionary — never copy the source examples; freshly written
  examples may be added in a later round.
- Keep the per-story vocabulary set manageable: about 8–10 core words
  rather than the entire source word list. Normalized lookup entries for
  hyphenated forms taught in the story (e.g. `fulltime` displaying
  "full-time") may supplement the core set beyond that count.
- Do **not** add private family details to any content.
- Grammar notes are written for Chinese-native learners, consistent with
  the existing articles' style.

## Data & routing model

- The 18 weeks live in `weeklyStories: WeeklyStory[]` in `lib/mockData.ts`.
  Only integrated weeks set `articleId`; unfinished weeks omit it and render
  as non-clickable "coming soon" cards — so no broken routes are ever
  generated (`generateStaticParams` only iterates real `articles`).
- Integrated weeks are normal entries in the existing `articles` array, so
  the reader, word lookup, TTS, and Challenge work with no special casing.

## Future batches

- Next batch: weeks 6–7, then 8–9 (weeks 4–9 approved as scope in
  `docs/plans/2026-07-10_content_and_turso_roadmap.md`; each batch still
  needs its own owner go-ahead), same adaptation rules.
- For each new week: add an `Article` (sentences + translations + grammar +
  quiz), add its key vocabulary to `lib/weeklyDictionary.ts` (keyed by
  lowercase base form; hyphenated words keyed by their normalized form,
  e.g. `fulltime` displaying "full-time"), and set `articleId` on the
  matching `weeklyStories` entry.
- Keep batches small and reviewable; do not bulk-import all 18 at once.

## Parent / teacher content review checklist

Before a weekly story is considered ready for the learner:

- [ ] English text is an original retelling (no verbatim source prose).
- [ ] Reading level fits the learner (sentence length, vocabulary).
- [ ] Every sentence has an accurate, natural Chinese translation.
- [ ] Grammar notes are correct and age-appropriate.
- [ ] Key vocabulary: IPA, part of speech, meaning, and a short
      collocation (per the weeks 1–5 convention, example sentences are
      intentionally omitted from the weekly dictionary; fresh examples may
      be added in a later round).
- [ ] Each quiz question has exactly one correct answer that is one of the
      options; distractors are plausible but clearly wrong.
- [ ] At least one grammar-style question where it fits the story.
- [ ] Tone is encouraging and not exam-like.
- [ ] No private or identifying family details.
- [ ] Content is copyright-safe for public deployment.
