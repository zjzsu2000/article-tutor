export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export type Dict = {
  htmlLang: string;
  nav: { topics: string; vocabulary: string };
  home: {
    title: string;
    subtitle: string;
    topicsHeading: string;
    weeklyHeading: string;
    weeklySubtitle: string;
  };
  topicCard: { cta: string };
  weekly: {
    week: (n: number) => string;
    comingSoon: string;
    read: string;
  };
  article: {
    backToTopics: string;
    minRead: string;
    tip: string;
    readAloud: string;
    stopReading: string;
    pause: string;
    resume: string;
    ttsUnsupported: string;
  };
  panel: {
    nothingSelected: string;
    nothingSelectedHint: string;
    word: string;
    sentence: string;
    definition: string;
    chinese: string;
    collocation: string;
    example: string;
    chineseTranslation: string;
    grammar: string;
    play: string;
    playSentence: string;
    save: string;
    saved: string;
    close: string;
    noEntry: string;
    notInDict: string;
  };
  vocabulary: {
    title: string;
    subtitle: (n: number) => string;
    empty: string;
    emptyHint: string;
    browse: string;
    remove: string;
    loading: string;
  };
  quiz: {
    heading: string;
    intro: string;
    start: string;
    progress: (cur: number, total: number) => string;
    types: Record<
      | "vocabulary"
      | "detail"
      | "main_idea"
      | "grammar"
      | "tense"
      | "singular_plural"
      | "comparative",
      string
    >;
    correct: string;
    incorrect: string;
    explanationLabel: string;
    correctAnswerLabel: string;
    yourWrongLabel: string;
    labelSep: string;
    next: string;
    finish: string;
    result: (score: number, total: number) => string;
    resultPerfect: string;
    resultGood: string;
    resultTry: string;
    restart: string;
  };
  level: Record<"Beginner" | "Intermediate" | "Advanced", string>;
  switcher: { label: string; zh: string; en: string };
};

const zh: Dict = {
  htmlLang: "zh-CN",
  nav: { topics: "主题", vocabulary: "生词本" },
  home: {
    title: "阅读 · 点击 · 学习",
    subtitle:
      "选择一个主题开始阅读。点击任意单词可查看释义和翻译，点击句子可查看译文与语法分析。",
    topicsHeading: "主题",
    weeklyHeading: "每周小故事",
    weeklySubtitle:
      "每周一个英语小故事，共 18 周。每篇都有逐句翻译、重点单词和闯关测试。",
  },
  topicCard: { cta: "开始阅读 →" },
  weekly: {
    week: (n) => `第 ${n} 周`,
    comingSoon: "待上线",
    read: "开始阅读 →",
  },
  article: {
    backToTopics: "← 返回主题列表",
    minRead: "分钟阅读",
    tip: "提示：点击单个单词可查看释义；点击句子的其他位置可查看译文与语法。",
    readAloud: "🔊 朗读全文",
    stopReading: "⏹ 停止",
    pause: "⏸ 暂停",
    resume: "▶ 继续",
    ttsUnsupported:
      "当前浏览器暂不支持朗读功能，可以换其他浏览器或设备试试。阅读、点词和点句子功能仍可正常使用。",
  },
  panel: {
    nothingSelected: "尚未选择内容",
    nothingSelectedHint:
      "点击任意单词查看释义，或点击句子查看译文与语法分析。",
    word: "单词",
    sentence: "句子",
    definition: "英文释义",
    chinese: "中文",
    collocation: "搭配",
    example: "例句",
    chineseTranslation: "中文翻译",
    grammar: "语法解析",
    play: "🔊 朗读",
    playSentence: "🔊 朗读句子",
    save: "+ 加入生词本",
    saved: "✓ 已保存 — 点击移除",
    close: "关闭",
    noEntry: "暂无词条。当前为模拟数据，仅词典中的常用词有详细信息。",
    notInDict: "这个词还没有收录，后面会补充。",
  },
  vocabulary: {
    title: "我的生词本",
    subtitle: (n) => `本设备已保存 ${n} 个单词。`,
    empty: "还没有保存任何单词。",
    emptyHint: "打开一篇文章，点击单词即可保存到这里。",
    browse: "浏览主题",
    remove: "移除",
    loading: "加载中…",
  },
  quiz: {
    heading: "闯关测试",
    intro: "读完啦？来闯三关，看看你都读懂了多少。",
    start: "开始闯关 →",
    progress: (cur, total) => `第 ${cur} / ${total} 关`,
    types: {
      vocabulary: "单词小侦探",
      detail: "细节小达人",
      main_idea: "主旨小队长",
      grammar: "语法小能手",
      tense: "时态小专家",
      singular_plural: "单复数小卫士",
      comparative: "比较级小高手",
    },
    correct: "答对啦！🎉",
    incorrect: "再想想，看看下面的提示～",
    explanationLabel: "提示",
    correctAnswerLabel: "正确答案",
    yourWrongLabel: "你的选择（不正确）",
    labelSep: "：",
    next: "下一关 →",
    finish: "看看结果 →",
    result: (score, total) => `闯关完成：${score} / ${total} 关`,
    resultPerfect: "太厉害啦，全部答对！🏆",
    resultGood: "很棒，再读一遍可以做得更好哦！👍",
    resultTry: "没关系，回到文章再读一读，然后再来闯关～💪",
    restart: "再闯一次",
  },
  level: { Beginner: "初级", Intermediate: "中级", Advanced: "高级" },
  switcher: { label: "语言", zh: "中文", en: "EN" },
};

const en: Dict = {
  htmlLang: "en",
  nav: { topics: "Topics", vocabulary: "Vocabulary" },
  home: {
    title: "Read. Click. Learn.",
    subtitle:
      "Pick a topic and start reading. Tap any word for a definition and translation, or tap a sentence to see how the grammar works.",
    topicsHeading: "Topics",
    weeklyHeading: "Weekly Stories",
    weeklySubtitle:
      "One short English story each week, 18 weeks in all. Every story has sentence translations, key words, and a Challenge.",
  },
  topicCard: { cta: "Start reading →" },
  weekly: {
    week: (n) => `Week ${n}`,
    comingSoon: "Coming soon",
    read: "Start reading →",
  },
  article: {
    backToTopics: "← All topics",
    minRead: "min read",
    tip: "Tip: click a single word for its meaning, or click anywhere else in a sentence to see its translation.",
    readAloud: "🔊 Read aloud",
    stopReading: "⏹ Stop",
    pause: "⏸ Pause",
    resume: "▶ Resume",
    ttsUnsupported:
      "Speech is not supported in this browser. You can try another browser or device. Reading, word lookup, and sentence explanation still work.",
  },
  panel: {
    nothingSelected: "Nothing selected yet",
    nothingSelectedHint:
      "Click any word to see its meaning, or click a sentence to see its translation and grammar breakdown.",
    word: "Word",
    sentence: "Sentence",
    definition: "Definition",
    chinese: "Chinese",
    collocation: "Collocation",
    example: "Example",
    chineseTranslation: "Translation",
    grammar: "Grammar",
    play: "🔊 Play",
    playSentence: "🔊 Play sentence",
    save: "+ Save to vocabulary",
    saved: "✓ Saved — tap to remove",
    close: "Close",
    noEntry:
      "No entry yet. This is mock data — only highlighted vocabulary has details.",
    notInDict: "This word is not in the dictionary yet.",
  },
  vocabulary: {
    title: "My Vocabulary",
    subtitle: (n) =>
      `${n} ${n === 1 ? "word" : "words"} saved on this device.`,
    empty: "No words saved yet.",
    emptyHint: "Open an article and tap a word to save it here.",
    browse: "Browse topics",
    remove: "Remove",
    loading: "Loading…",
  },
  quiz: {
    heading: "Challenge",
    intro: "Finished reading? Take on three quick challenges and see how much you understood.",
    start: "Start the challenge →",
    progress: (cur, total) => `Challenge ${cur} / ${total}`,
    types: {
      vocabulary: "Word Detective",
      detail: "Detail Expert",
      main_idea: "Main Idea Captain",
      grammar: "Grammar Whiz",
      tense: "Tense Detective",
      singular_plural: "Plural Patrol",
      comparative: "Compare Champ",
    },
    correct: "That's right! 🎉",
    incorrect: "Not quite — check the hint below.",
    explanationLabel: "Hint",
    correctAnswerLabel: "Correct answer",
    yourWrongLabel: "Your choice (incorrect)",
    labelSep: ": ",
    next: "Next →",
    finish: "See your result →",
    result: (score, total) => `Done: ${score} / ${total} correct`,
    resultPerfect: "Amazing — a perfect score! 🏆",
    resultGood: "Nice work! Read it again to do even better. 👍",
    resultTry: "No worries — read the article once more, then try again. 💪",
    restart: "Try again",
  },
  level: {
    Beginner: "Beginner",
    Intermediate: "Intermediate",
    Advanced: "Advanced",
  },
  switcher: { label: "Language", zh: "中文", en: "EN" },
};

const dicts: Record<Locale, Dict> = { zh, en };

export function getDict(locale: Locale): Dict {
  return dicts[locale] ?? dicts[defaultLocale];
}
