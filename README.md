# Article Tutor

An English reading tool for Chinese-native school-age learners. Pick a
topic, read an article, tap any word or sentence to see the meaning,
translation, and grammar notes, and save words to a personal vocabulary
list. Optional read-aloud helps with listening and pronunciation.

This is the **main reading app**. A separate single-file **HTML sandbox**
lives in its own repo for rapid ideation and hand-entered vocabulary
experiments. The two are deliberately separate (see
[Relation to the HTML sandbox](#relation-to-the-html-sandbox)).

---

## Product purpose

Help young learners read real English articles **without losing the flow**:
when they hit a word they don't know, a tap explains it; when they hit a
sentence they can't parse, a tap shows the translation and a simple
grammar note. Words they want to remember go into a personal vocabulary
list, in the browser, no account needed.

## Target users

- **Primary**: elementary and middle-school learners whose first language
  is Chinese.
- **Secondary**: parents and teachers who want a clean, focused, ad-free
  reading tool for their kids.

## Current features

- Topic-based article cards on the home page (8 seed articles across 8
  topics: school life, animals, science, sports & health, festivals,
  Olympic Games, a young inventor, helpful robots)
- Article reader with sentence-by-sentence layout
- Tap a word → English definition, Chinese meaning, IPA, example
- Tap a sentence → Chinese translation + simple grammar note
- Personal vocabulary list (stored in `localStorage`, per device)
- TTS read-aloud: full article / per sentence / per word
- Read-aloud Pause / Resume / Stop
- Sentence-level highlight while the full article is playing
- Friendly fallback notice on browsers without Web Speech API support
- Slowed default speech rate (0.7) for early learners
- Per-article quiz data structure (3 questions: vocabulary, detail, main
  idea) — UI **not yet** implemented (planned for v0.3 as Challenge UI /
  闯关测试)

See [`CHANGELOG.md`](./CHANGELOG.md) for version history and
[`docs/product-notes/2026-05-16-feedback-and-roadmap.md`](./docs/product-notes/2026-05-16-feedback-and-roadmap.md)
for what's coming next.

## Tech stack

- Next.js 14 (App Router) with `output: "export"` — fully static
- TypeScript
- Tailwind CSS
- `localStorage` for saved words and (later) progress
- Web Speech API (`speechSynthesis`) for read-aloud
- No backend, no database, no auth, no API routes, no server runtime

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build a static export

```bash
npm run build
```

The static site is written to `out/`. Any static host can serve it. See
[`docs/development/DEPLOYMENT.md`](./docs/development/DEPLOYMENT.md) for
push-based and manual deploy notes.

## Pages

- `/` — redirects to the default locale
- `/[locale]` — topic cards (locales: `zh`, `en`)
- `/[locale]/articles/[id]` — article reader with side info panel
- `/[locale]/vocabulary` — saved words

## Where the mock data lives

`lib/mockData.ts` — topics, articles, sentence translations, grammar
notes, the dictionary used for word lookups, and the per-article quiz
data.

## Relation to the HTML sandbox

The HTML sandbox is a single-page experiment lab living in a different
repo. It lets a learner or parent quickly hand-enter vocabulary,
examples, and try ideas without going through a full build / deploy.

The split is intentional:

| Concern | Main reading app (this repo) | HTML sandbox |
|---|---|---|
| Audience | Learners reading curated content | Authors trying ideas |
| Stability | Stable, deployed, learnable | Free to break, fast iteration |
| Content | Curated, reviewed | Anything goes |
| Stack | Next.js + Tailwind + static export | Single HTML + JS file |

Good ideas tested in the sandbox can be promoted into curated content
here.

## Public content and copyright rule

This repo and any deployment built from it are public.

- **Do not** add copyrighted modern book excerpts, current textbook
  passages, or other copyrighted prose to the seed content.
- **Do** add original prose written for this project, public-domain
  works, or graded retellings inspired by public-domain works.
- A learner's private local-only experimentation with copyrighted text
  is their own decision but **must not** be committed to this repo or
  appear in any public deployment.

This protects the project from takedown risk and platform account
suspension, and keeps the content base reusable.

## Project docs

- [`CHANGELOG.md`](./CHANGELOG.md) — version history
- [`docs/release-notes/`](./docs/release-notes) — per-release notes
- [`docs/product-notes/`](./docs/product-notes) — product feedback,
  roadmap, design principles
- [`docs/development/DEPLOYMENT.md`](./docs/development/DEPLOYMENT.md) —
  how to deploy the static export
- [`docs/development/AI_WORKFLOW.md`](./docs/development/AI_WORKFLOW.md) —
  how AI coding assistants are expected to work in this repo

---

# 中文说明

面向**中文母语中小学生**的英语阅读工具。挑一个主题、读一篇文章、点任意
词或句子立刻看到释义/翻译/语法、把生词收进自己的单词本。另有朗读功能辅
助听力和发音。

这是**正式阅读版**仓库。另有一个**单页 HTML 沙盒**在独立仓库里，用于快速
试想法、手动录入单词等轻量实验。两者刻意分开（见下方"主程序与 HTML 沙盒
的区别"）。

## 目标用户

- **主要**：母语为中文的小学和初中学生
- **次要**：希望给孩子一个干净、专注、无广告阅读工具的家长和老师

## 当前已具备的功能（截至 v0.2）

- 主题文章卡片（8 个学生主题、8 篇种子文章）
- 文章逐句阅读
- 点单词 → 英文释义、中文意思、音标、例句
- 点句子 → 中文翻译 + 简单语法说明
- 个人生词本（存 `localStorage`，按设备）
- TTS 朗读：朗读全文 / 朗读句子 / 朗读单词
- 暂停 / 继续 / 停止
- 朗读全文时当前句子高亮
- 不支持 Web Speech API 的浏览器显示友好提示
- 默认朗读语速 0.7，照顾低龄学习者
- 每篇文章 3 道闯关测试数据已就绪（vocabulary / detail / main_idea），UI 待 v0.3

## 公开内容版权规则

本仓库与基于它的部署都是公开的。

- **不要**把现代版权书籍、教材摘录或受版权保护的文本加入种子内容。
- **可以**加入：原创短文、公版作品、基于公版作品的分级改写。
- 学习者私下用版权材料练手是个人选择，但**不能**提交到本仓库或出现在
  任何公开部署中。

这是为了避免版权风险和平台账号被封，也让内容库可以长期复用。

## 设计原则（简版）

1. **阅读为入口，不是单词为入口** —— 单词必须在文章语境里出现
2. **小而精** —— MVP 只做闭环，不做后台 / 课程 / 支付 / 社区
3. **服务中文母语学生** —— 解释、例句、语法都从中文视角和学生水平出发
4. **干净、专注、家长放心** —— 无广告、无复杂社交、无让孩子分心的弹窗
5. **静态导出是硬约束** —— 保持 `output: "export"` 可用

完整原则与路线图见
[`docs/product-notes/2026-05-16-feedback-and-roadmap.md`](./docs/product-notes/2026-05-16-feedback-and-roadmap.md).
