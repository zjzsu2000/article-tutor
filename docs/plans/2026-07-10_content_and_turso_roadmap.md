# 规划文档：内容扩充（第 4–9 周 + 题库）+ 用户数据库（生词本 / 挑战记录 / 错题本）

> **状态：草案（Draft）— 仅为规划文档，未批准实施。**
> 在项目所有者明确批准之前，所有既有约束继续有效：静态导出（`output: "export"`）保持不变，不新增后端 / API / 认证 / 数据库代码，不新增依赖，不改配置，且遵守"无人工批准不 commit / push / deploy"门禁。
>
> 起草日期：2026-07-10

## 背景与目标

Article Tutor 目前只有 3 周的周故事内容（共 18 周规划），4 篇主题文章题库不完整（各仅 3 题），生词本和挑战记录只存在浏览器 localStorage 里——换设备/清缓存即丢失，且无法区分"每个人"。本计划要达成：

1. **内容扩充**：新增第 4–9 周共 6 篇原创改写故事（含生词、题目），并把 4 篇薄题库文章补全到每篇约 9 题（词汇/理解/语法各 3 题）。
2. **用户数据库**：接入所有者现有的 Turso（沿用 `S_Test_Web` 的 `@libsql/client` 模式），实现"昵称 + 4 位 PIN"简易档案；每人的生词本、每次挑战记录（含所选答案、对错、正确答案解释的快照）入库；新增"挑战记录 / 错题本"页面；答错的词汇题自动存入生词本。
3. **发布**：内容与后端分阶段上线，每轮走项目既有的 Codex 审核包 + 人工审批门禁（AGENTS.md）。

**关键架构变更（获批后才执行）**：去掉 `output: "export"`，Next.js 转为服务端模式（页面仍静态生成，仅 `app/api/**` 动态），部署继续走 Vercel。**Cloudflare Pages 静态镜像将无法继续同步，建议退役或冻结为存档**（见风险 1）。内容（文章/题目/词典）仍留在 git 里维护，数据库只存用户数据。

## 已确认的方向性决策（由所有者在规划阶段选定）

- 数据库：现有 Turso 账号，新建专用库 `english-study`；环境变量 `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` / `SESSION_SECRET`；本地开发零配置回退到 `file:data/app.db`。
- 用户识别：昵称 + 4 位 PIN（scrypt 哈希，node:crypto 零新依赖）；HMAC 签名 httpOnly Cookie 会话（180 天）。**游客模式永久保留**：不登录时行为与今天完全一致（localStorage）。
- 内容批量：第 4–9 周。源文档：`/Users/zhzja/code/english_learning_notes/每周一个小故事.docx`（用 `textutil -convert txt -stdout` 提取；提取文本中"第4周"约在 310 行，"第9周"为 841–946 行区段）。
- 新依赖仅 `@libsql/client`（不引入 drizzle，沿用 S_Test_Web 的裸 SQL helper + 幂等 `ensureSchema()` 模式）。

---

## Phase 1 — 题库扩充（纯内容，现架构直接可发）

**文件**：`lib/mockData.ts`、`lib/types.ts`

1. 给 4 篇薄文章（`favorite-festival`、`olympic-games`、`young-inventor`、`robots-help`）各补 6 题（词汇 2 + 理解 1 + 语法组 3），每题带面向孩子的英文 `explanation`（沿用现有题目的英文解释风格），沿用 `q1..qN` 编号。
2. 其余文章统一补到恰好 9 题（三组各 3 题）。
3. `lib/types.ts` 的 `Question` 增加可选字段 `word?: string`（词汇题标注被考察的单词），本阶段顺手给所有词汇题填上——Phase 4b 的"错题自动存生词本"依赖它，现在填避免二次改内容。对现有行为零影响。

`lib/quiz.ts` 的 `selectAttempt`（每组抽 1、避开近 6 题历史）无需改动。

**验证**：`npx tsc --noEmit` + `npm run build`（路径数不变 22）；同一文章连做 3 次挑战确认含语法题且重复率低。

## Phase 2 — 第 4–9 周周故事（纯内容，每轮 1–2 周）

**每周改动**：`lib/mockData.ts`（新增 Article + 给 `weeklyStories` 对应项设 `articleId`，即"待上线→上线"的开关）、`lib/weeklyDictionary.ts`（8–10 个词条，`sourceWeek: N`）。

每周流程（遵循 `docs/content-plans/2026-06-04-weekly-stories-track.md` 改编规则）：

1. **原创改写，绝不照抄**源文（约 12–18 句，Intermediate），id 沿用 `weekly-N-<slug>`（如 `weekly-4-…` 到 `weekly-9-london-journey`），周索引里已有的中英标题/主题直接复用；不含家庭隐私。
2. 每句配自然中文 `translation` + 一个教学点 `grammar` 注释。
3. 生词入 `weeklyDictionary.ts`：只用词条事实（音标/词性/中文义/搭配），例句全部新写；与既有词条撞 key 时保留旧条目换选别的词。
4. 每篇 6–9 题（覆盖三组、语法组 ≥2 题、每题有解释、词汇题填 `word`）。
5. **家长审核门禁**：每轮提交前在审核包里输出内容清单（原创性对照、难度、词数、题目覆盖、无隐私）。

**验证**：tsc + build，确认每上线 1 周路径 +2（如 4–5 周轮：22→26）；点词查词可命中新词条；题目可完整做完；旧周不受影响。

## Phase 3 — 后端基建（服务端模式 + Turso + 认证 + API）

无任何 UI 变化，游客不受影响；可独立发布。

### 3.1 配置与依赖

- `next.config.mjs`：删除 `output: "export"`；保留 `trailingSlash: true`（URL 不变）与 `images.unoptimized`。
- `package.json`：新增 `@libsql/client`（^0.17，与 S_Test_Web 同大版本）。
- `.gitignore` 加 `data/`；新增 `.env.example` 说明三个环境变量（本地可全不设）。
- **所有者需执行**：`turso db create english-study` + `turso db tokens create english-study`，把三个变量配到 Vercel（Production + Preview；家庭规模两环境共用一库即可）。
- 清理本地过期的 `out/`。

### 3.2 新文件（照搬 S_Test_Web 模式）

- `lib/server/db.ts`：改编自 `S_Test_Web/lib/db/client.ts` —— URL 解析（TURSO_DATABASE_URL → DATABASE_URL → `file:data/app.db`）、**惰性**记忆化 `getDbClient()`（保证无环境变量时 `next build` 通过）、`all/get/run/batch` helper。
- `lib/server/schema.ts`：幂等 `CREATE TABLE IF NOT EXISTS` + 记忆化 `ensureSchema()`（模板：`S_Test_Web/lib/db/migrate.ts`）。
- `lib/server/auth.ts`：scrypt PIN 哈希（`scrypt:<N>:<r>:<p>:<salt>:<hash>`，timingSafeEqual 校验）；会话 Cookie `es_session` = `v1.<userId>.<expiresMs>.<hmac>`（HMAC-SHA256 by `SESSION_SECRET`，httpOnly/SameSite=Lax/生产 Secure/180 天）；`getSessionUser()`。
- 前置小改：`lib/storage.ts` 导出 `normalizeSavedWord`（纯函数、无 window 访问，服务端导入安全）。

### 3.3 表结构（Turso/SQLite）

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname TEXT NOT NULL,
  nickname_lc TEXT NOT NULL UNIQUE,      -- 大小写不敏感唯一
  pin_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL, last_login_at INTEGER
);
CREATE TABLE IF NOT EXISTS saved_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  word TEXT NOT NULL, word_lc TEXT NOT NULL,
  entry_json TEXT NOT NULL,              -- 完整 SavedWord JSON（可选字段多且会演化）
  saved_at INTEGER NOT NULL,
  UNIQUE (user_id, word_lc)              -- 与客户端 saveWord/isSaved 的小写去重语义一致
);
CREATE INDEX IF NOT EXISTS idx_saved_words_user ON saved_words(user_id, saved_at DESC);
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,                   -- randomUUID
  user_id INTEGER NOT NULL REFERENCES users(id),
  article_id TEXT NOT NULL, article_title TEXT NOT NULL,  -- 标题快照
  track TEXT, week_number INTEGER, locale TEXT NOT NULL DEFAULT 'zh',
  score INTEGER NOT NULL, total INTEGER NOT NULL, finished_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON quiz_attempts(user_id, finished_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_user_article ON quiz_attempts(user_id, article_id);
CREATE TABLE IF NOT EXISTS attempt_answers (
  attempt_id TEXT NOT NULL REFERENCES quiz_attempts(id),
  position INTEGER NOT NULL,
  question_id TEXT NOT NULL,             -- q1/q2… 仅文章内唯一
  question_type TEXT NOT NULL,
  question_text TEXT NOT NULL, options_json TEXT NOT NULL,  -- 快照
  chosen TEXT NOT NULL, correct_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  explanation TEXT NOT NULL,             -- 快照：错题本的稳定复习文本
  word TEXT,
  PRIMARY KEY (attempt_id, position)
);
```

**为什么全量快照**：题目 id 仅文章内唯一，且内容在 git 里会持续修订（Phase 1/2 就在改）——快照保证错题本永远可读，展示时绝不回 join `mockData`。

### 3.4 API 路由（`app/api/**/route.ts`，Node runtime，每个 handler 先 `await ensureSchema()`）

| 路由 | 方法 | 请求 → 响应 | 要点 |
|---|---|---|---|
| `/api/auth/register` | POST | `{nickname, pin}` → 201 `{user}` + cookie | 昵称 trim 1–20 字；pin `^\d{4}$`；重名 409 |
| `/api/auth/login` | POST | `{nickname, pin}` → `{user}` + cookie | 错误统一 401"昵称或 PIN 不对"（防枚举）；更新 last_login_at |
| `/api/auth/logout` | POST | → `{ok}` 清 cookie | |
| `/api/auth/me` | GET | → `{user \| null}`（恒 200） | 客户端启动探测 |
| `/api/words` | GET/POST/DELETE | 与 `saveWord/removeWords` 同语义，返回全量列表 | POST 用 `ON CONFLICT DO NOTHING` 幂等 |
| `/api/words/import` | POST | `{words: SavedWord[]}` → `{imported, words}` | 一次性导入 localStorage；服务端用 `normalizeSavedWord` 清洗、跳过重复、`batch` 写入 |
| `/api/attempts` | POST | `{articleId, locale, answers:[{questionId, chosen}]}` → 201 | **服务端判分 + 快照**：经 `getArticle()` 取权威内容，校验 chosen ∈ options，attempt+answers 单 `batch` 落库 |
| `/api/attempts` | GET | `?limit=50` → 最新在前、答案内嵌 | 供记录/错题本页一次取全 |

**本地零配置可测**：`npm run dev` 后 curl 全流程（register 201 → 重名 409 → 错 PIN 401 → words 增删查 → attempts 提交/查询），库文件 `data/app.db`，重置 = 删文件。

**验证**：tsc；**不设任何环境变量跑 `npm run build`**（证明无 import 期连库）；curl 全流程；Vercel Preview 配好变量后重跑 curl + 确认旧页面 URL（含尾斜杠）全部不变。审核包与 `docs/checkpoint.md` 里明确记录 Cloudflare 镜像退役决定。

## Phase 4a — 客户端：档案 + 数据库生词本

**新文件**：
- `lib/session.ts`：`fetchSession/login/register/logout` 封装，变更后派发 `session:changed` 事件（沿用 `savedWords:changed` 的事件模式）。
- `lib/words.ts`（门面）：`getWords/addWord/deleteWords/checkSaved/getCount` —— 登录走 API（模块级缓存服务端列表），未登录走现有 `lib/storage.ts` 原样不动；变更后照旧派发 `savedWords:changed`。登录态下 API 失败显示错误、**不**静默回落 localStorage（避免两本账）。
- `components/ProfileMenu.tsx`：Navbar 按钮（登录显昵称，否则"登录"），儿童友好弹窗：登录/新建两个页签、大号 4 格 PIN 输入、双语提示。登录成功后若本机有生词且 `english_study.imported.<userId>` 标记未设：一次性询问"把这台设备上的 N 个生词导入到你的账号？"→ `/api/words/import`，设标记，**保留本地副本**（同一设备可能还有别的孩子当游客用）。

**改动**：`Navbar.tsx`（挂 ProfileMenu、词数改走门面、监听 `session:changed`）、`InfoPanel.tsx` / `VocabularyClient.tsx`（改用门面，分组/批删逻辑不动；"仅本机保存"提示改为会话感知文案）、`lib/i18n.ts`（`auth.*` 双语串）。

**验证**：游客全流程与今天逐字节一致（零 `/api/words` 请求）；注册→导入→数据库出词；第二个浏览器登录同账号见同一本生词本；登出回到本机本地生词本；API 挂掉时报错不污染本地数据。

## Phase 4b — 挑战记录、错题本页、错词自动入本

**新文件**：`app/[locale]/history/page.tsx`（静态壳，照抄 vocabulary 页的 locale 模式）+ `components/HistoryClient.tsx`：游客显示"登录后可看挑战记录和错题本"引导；登录后 GET `/api/attempts`，两个页签——**挑战记录**（按日期列文章快照标题、得分、周徽章）与**错题本**（`is_correct=0` 按文章分组，快照渲染题面/所选/正确项/解释，复用 ArticleQuiz 已答态视觉，附回原文重练链接）。

**改动**：
- `ArticleQuiz.tsx`：`handleNext` 完成瞬间（进入 done 的**活转换**，恢复已完成进度的路径不提交，防重复）：有会话则 fire-and-forget POST `/api/attempts`，绝不阻塞庆祝页；对每道答错且带 `word` 的题，`lookupWord(word)` 后经门面 `addWord`（游客也生效，落 localStorage）——顺手完成路线图上"错题词汇自动收集"这项。
- `Navbar.tsx` + `lib/i18n.ts`：加"记录/History"入口与 `history.*` 双语串。

**范围说明**：做题进度恢复（quizProgress）与近题历史（quizHistory）**保持 localStorage**——按设备恢复即可，控制 API 面。

**验证**：tsc + build；登录做题错 1 题 → 记录页出现该次、错题本含解释快照、错词已带来源信息入生词本；本地改 mockData 题面确认历史仍显示旧快照（快照需求的直接证明）；游客做题与今天一致且错词照存本地；恢复已完成的挑战不重复 POST。

---

## 风险与说明

1. **Cloudflare Pages 镜像退役**：服务端模式没有 `out/`，Pages 也跑不了这些 API。建议删除或把最后一版静态构建冻结为存档，并从 checkpoint.md 移除部署命令。若将来大陆访问需要，可另议整体迁 Cloudflare（与本次"复用 Turso + Vercel、最小改动"决策冲突，不在本轮）。
2. **4 位 PIN 是便利不是安全**：1 万种组合，仅防误用；无敏感数据；v1 不做找回，家长可用 `turso db shell` 重置（会写入文档配方）。
3. **导入边界**：老数据缺字段（复用 `normalizeSavedWord`）、大小写重复（唯一索引 + 冲突忽略）、共用设备（标记按 userId、本地不删）、重复点导入（设计上幂等）。
4. **去静态导出副作用**：`trailingSlash` 保持 URL 不变；无环境变量构建必须常绿（惰性连库）；Vercel 自动识别服务端模式，无需 vercel.json。
5. **游客模式是永久特性**：除跨设备同步和记录页外一切可用，门面处理所有 401，UI 永不强制登录。
6. 跨设备并发为 last-write-wins，家庭规模可接受。

## 发布节奏（沿用小 diff + 审核门禁）

1. Phase 1 两轮（先 4 篇薄文章 + `word` 字段，后其余补题）→ 审核 → 发布（现架构，push 即 Vercel 上线）。
2. Phase 2 三轮（4–5、6–7、8–9 周），每轮过家长内容审核清单。
3. Phase 3 一轮（最大 diff 但零 UI 变化）+ 所有者执行 Turso 建库/Vercel 配变量。
4. Phase 4a → 4b 各一轮。每轮随附 checkpoint.md / CHANGELOG 更新，全程遵守"无人工批准不 commit/push/deploy"。
