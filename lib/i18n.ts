export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export type Dict = {
  htmlLang: string;
  nav: { topics: string; vocabulary: string };
  home: { title: string; subtitle: string; topicsHeading: string };
  topicCard: { cta: string };
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
    example: string;
    chineseTranslation: string;
    grammar: string;
    play: string;
    playSentence: string;
    save: string;
    saved: string;
    close: string;
    noEntry: string;
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
  },
  topicCard: { cta: "开始阅读 →" },
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
    example: "例句",
    chineseTranslation: "中文翻译",
    grammar: "语法解析",
    play: "🔊 朗读",
    playSentence: "🔊 朗读句子",
    save: "+ 加入生词本",
    saved: "✓ 已保存 — 点击移除",
    close: "关闭",
    noEntry: "暂无词条。当前为模拟数据，仅词典中的常用词有详细信息。",
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
  },
  topicCard: { cta: "Start reading →" },
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
