# English Study — MVP

A Next.js + Tailwind reading app for English learners. Pick a topic, read an
article sentence-by-sentence, and click any word or sentence to see meaning,
translation, and grammar notes. Save words to a personal vocabulary list
stored in your browser.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- localStorage for saved words (no backend)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Pages

- `/` — topic cards
- `/articles/[id]` — article reader with right-side info panel
- `/vocabulary` — saved words

## Where the mock data lives

`lib/mockData.ts` — topics, articles, sentence translations, grammar notes,
and the dictionary used for word lookups.

---

# 中文说明

这是一个面向**中文母语者**的英语精读工具，不是普通的"背单词网站"。

核心理念：**用真实的英文文章来提升职场英语和知识输入能力**。

## 它解决的问题

市面上背单词 App 很多，单独背单词效率很低，因为脱离了语境。我们希望让用
户在阅读真实文章的过程中：

- 遇到不认识的单词，点一下就能看到释义、音标、例句
- 遇到看不懂的句子，点一下就能看到中文翻译和句子结构
- 把生词随手收藏到自己的单词本，后续复习
- 按主题（科技 / 商业 / AI / 职场 / 面试 / 金融 / 信仰）选择文章

## 目标用户

成年人 / 职场人，尤其是：

- 程序员
- 留学生 / 移民
- 想读英文新闻和技术文章的人
- 想提升英文面试与职场表达的人
- 想用英文学习 AI、商业、金融内容的人

## 当前状态（MVP v0）

第一版只做了一个最小闭环，所有数据都是写死的 mock：

1. 主题选择（首页）
2. 文章列表
3. 文章阅读 + 点击单词解释
4. 点击句子查看翻译和语法
5. 收藏单词到 localStorage
6. 单词本页面

目的是先把"读文章 → 点词查义 → 收藏 → 复习"这个闭环跑通，再往上加东西。

---

# 未来发展路线

## 阶段一：MVP 完整化（当前）

- [x] 静态原型：主题、文章列表、阅读页、单词本
- [x] 点击单词显示释义
- [x] 点击句子显示翻译和语法
- [x] localStorage 收藏

## 阶段二：接入 AI（预生成 + 缓存）

不要每次点击都实时调用 AI，成本和速度都不好控制。更好的方式是**文章上传
时后台预生成，用户点击时直接读数据库**：

- 文章导入后自动分句
- 自动生成重点单词及释义
- 自动生成句子翻译和语法分析
- 自动生成文章摘要
- 自动生成 5 道理解小测验

实时 AI 只用在用户主动追问时（"再举一个例子" / "解释一下这个语法"）。

## 阶段三：用户系统 + 数据库

迁移到 PostgreSQL，主要表：

```
users
topics
articles
article_sentences
vocabulary
user_saved_words
user_reading_progress
ai_explanations
```

实现：

- 用户登录
- 跨设备同步收藏
- 阅读进度
- 简单的复习状态机（new / learning / mastered）

## 阶段四：主题词汇包

两种录入方式：

**A. 手动录入**：用户输入一组词，系统自动补齐释义、例句、发音、相关短
语、小测验。

**B. AI 对话生成**：用户说"我想学 AI 创业相关的英语"，AI 自动生成一个词
汇包（20 个核心词 + 10 个常用短语 + 5 个真实场景对话 + 1 篇短文 + 练习
题）。

## 阶段五：跟读与口语

- 文章音频朗读（TTS）
- 用户跟读 + 发音评分
- AI 对话练习（围绕已读文章的话题）
- 面试场景模拟

## 阶段六：差异化方向

不和 Anki / 多邻国 / 不背单词 直接竞争，定位在：

> 面向成年人和职场人的英文阅读学习工具

特别照顾这些场景：英文新闻精读、技术文章精读、AI / 商业 / 金融内容学
习、英文面试表达、信仰 / 圣经英文。

---

# 设计原则

1. **阅读为入口，不是单词为入口** —— 单词必须在文章语境里出现
2. **预生成优先于实时调用** —— AI 成本和延迟可控
3. **不做大而全** —— MVP 只做闭环，不做后台 / 课程 / 支付 / 社区
4. **服务中文母语者** —— 解释、例句、语法都从中文视角出发
