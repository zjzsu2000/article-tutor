# Article Tutor — MVP

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

这是一个面向**中文母语学生**的英语精读工具，不是普通的"背单词网站"，
也不是"在线网课平台"。

核心理念：**让学生在真实的英文文章里，点一下就能看懂单词和句子，并把生
词沉淀到自己的单词本。**

## 它解决的问题

- 单独背单词效率很低，因为脱离了语境
- 看英文文章时遇到不会的词/句，查字典很麻烦，节奏被打断
- 课内外阅读积累的生词，没有一个干净的地方收起来反复复习
- 普通背单词 App 内容偏成人，学生用着不合适

## 目标用户

**中小学生 / 英语初学者**，以及

- 想提升英语阅读能力的学生
- 想按主题积累词汇的学生
- 需要练习阅读理解的学生
- 想通过文章而不是孤立背单词学英语的学生
- 希望孩子有一个**干净、专注、可控**的英语阅读工具的家长

## 主题方向（学生友好）

- 校园生活（School Life）
- 动物与自然（Animals & Nature）
- 科学启蒙（Science）
- 运动与健康（Sports & Health）
- 旅行与城市（Travel）
- 节日文化（Festivals）
- 名人故事（Famous People）
- 科技入门（Technology for Kids）
- 简单新闻（Easy News）

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

## 阶段二：学生友好的内容与界面

把当前 mock 内容全部替换为**适合学生的主题与文章**：

- 每篇文章标注难度：Grade 3 / Grade 5 / Middle School
- 每篇文章标注预计阅读时间（3 分钟 / 5 分钟）
- 每篇文章标注重点生词数量（8 个 / 12 个）
- 文章末尾配 5 道阅读理解小测验
- 自然拼读 / 英式或美式朗读
- 单词解释中加入词性、音标、例句

## 阶段三：跟读与朗读

- 文章音频朗读（TTS）
- 单词逐个跟读，可调整停顿时长
- 句子跟读 + 简单发音反馈
- 自然拼读小练习

## 阶段四：接入 AI（预生成 + 缓存）

不要每次点击都实时调用 AI，成本和速度都不好控制。更好的方式是**文章上
传时后台预生成，用户点击时直接读数据库**：

- 文章导入后自动分句
- 自动生成重点单词及释义（学生友好的解释）
- 自动生成句子翻译和简化语法说明
- 自动生成 5 道理解小测验

实时 AI 只用在用户主动追问时（"再举一个例子" / "用更简单的话说一遍"）。

## 阶段五：用户系统 + 学习记录

- 用户登录
- 跨设备同步收藏
- 阅读进度
- 简单的复习状态机（new / learning / mastered）
- 今日连续学习 + 星星奖励
- 家长查看学习记录

## 阶段六：可能的副线 —— 成人 / 职场版本

学生主线稳定后，可以**单独**做一个面向成人的分支版本：

- 主题：AI、商业、金融、面试、职场沟通、技术文章、英文新闻
- 受众：程序员、留学生、职场人、想读英文新闻的人

这只是**可能的未来副线**，不是当前主项目要做的事。学生版与成人版应该
**分开定位、分开内容、分开品牌**，不混在一起。

---

# 设计原则

1. **阅读为入口，不是单词为入口** —— 单词必须在文章语境里出现
2. **预生成优先于实时调用** —— AI 成本和延迟可控
3. **不做大而全** —— MVP 只做闭环，不做后台 / 课程 / 支付 / 社区
4. **服务中文母语学生** —— 解释、例句、语法都从中文视角和学生水平出发
5. **干净、专注、家长放心** —— 没有广告、没有复杂社交、没有让孩子分心
   的弹窗
