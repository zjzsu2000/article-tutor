export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export type Dict = {
  htmlLang: string;
  nav: { topics: string; vocabulary: string; dictation: string };
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
    // phrases (multi-word vocabulary items)
    phrase: string;
    phraseNoEntry: string;
    phraseParts: string;
    extendLeft: string;
    extendRight: string;
    shrinkLeft: string;
    shrinkRight: string;
    extendHint: string;
    resetSelection: string;
    // learner-written meaning
    myMeaning: string;
    dictionaryMeaning: string;
    addMeaning: string;
    editMeaning: string;
    meaningPlaceholder: string;
    saveMeaning: string;
    cancelMeaning: string;
    clearMeaning: string;
    meaningSavesWord: string;
  };
  vocabulary: {
    title: string;
    subtitle: (n: number) => string;
    empty: string;
    emptyHint: string;
    browse: string;
    remove: string;
    loading: string;
    deviceNoteZh: string;
    deviceNoteEn: string;
    // grouping / filtering
    filterLabel: string;
    allWords: string;
    weekGroup: (n: number) => string;
    otherArticles: string;
    uncategorized: string;
    groupEmpty: string;
    // selection / batch delete
    select: string;
    exitSelect: string;
    selectedCount: (n: number) => string;
    deleteSelected: string;
    clearSelection: string;
    nothingSelected: string;
    // confirmation dialog
    confirmTitle: string;
    confirmSingle: (word: string) => string;
    confirmBatch: (n: number) => string;
    confirmDelete: string;
    cancel: string;
    // phrases + learner-written meanings
    phraseBadge: string;
    myMeaningLabel: string;
    dictionaryMeaningLabel: string;
    addMeaning: string;
    editMeaning: string;
    noMeaning: string;
    practiceCta: string;
  };
  dictation: {
    title: string;
    subtitle: string;
    intro: string;
    start: string;
    prompt: string;
    inputPlaceholder: string;
    check: string;
    next: string;
    finish: string;
    reveal: string;
    correct: string;
    wrong: string;
    answerLabel: string;
    hint: string;
    showHint: string;
    letters: (n: number) => string;
    phraseBadge: string;
    progress: (cur: number, total: number) => string;
    result: (score: number, total: number) => string;
    resultPerfect: string;
    resultGood: string;
    resultTry: string;
    again: string;
    practiceWrong: string;
    play: string;
    empty: string;
    emptyHint: string;
    goVocabulary: string;
    needMeaning: (n: number) => string;
    scopeLabel: string;
    allWords: string;
    ready: (n: number) => string;
  };
  myArticles: {
    title: string;
    subtitle: string;
    homeHeading: string;
    homeHint: string;
    add: string;
    titleLabel: string;
    titlePlaceholder: string;
    textLabel: string;
    textPlaceholder: string;
    save: string;
    cancel: string;
    edit: string;
    remove: string;
    confirmTitle: string;
    confirmDelete: (title: string) => string;
    confirmYes: string;
    empty: string;
    emptyHint: string;
    read: string;
    sentenceCount: (n: number) => string;
    needTitle: string;
    needText: string;
    deviceNoteZh: string;
    deviceNoteEn: string;
    notFound: string;
    back: string;
    readerNote: string;
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
  nav: { topics: "主题", vocabulary: "生词本", dictation: "听写" },
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
    phrase: "词组",
    phraseNoEntry: "词典里还没有这个词组，你可以自己写下中文意思。",
    phraseParts: "逐词看",
    extendLeft: "← 加左边的词",
    extendRight: "加右边的词 →",
    shrinkLeft: "去掉左边的词 →",
    shrinkRight: "← 去掉右边的词",
    extendHint: "想学一个词组？用下面的按钮逐个添加或去掉两边的单词。",
    resetSelection: "只看这一个词",
    myMeaning: "我的释义",
    dictionaryMeaning: "词典释义",
    addMeaning: "✎ 写下我的中文意思",
    editMeaning: "✎ 修改我的释义",
    meaningPlaceholder: "用你自己的话写中文意思",
    saveMeaning: "保存",
    cancelMeaning: "取消",
    clearMeaning: "清除",
    meaningSavesWord: "保存释义时会自动加入生词本。",
  },
  vocabulary: {
    title: "我的生词本",
    subtitle: (n) => `本设备已保存 ${n} 个单词。`,
    empty: "还没有保存任何单词。",
    emptyHint: "打开一篇文章，点击单词即可保存到这里。",
    browse: "浏览主题",
    remove: "移除",
    loading: "加载中…",
    deviceNoteZh: "生词仅保存在当前设备和浏览器。",
    deviceNoteEn: "Vocabulary is saved only on this device and browser.",
    filterLabel: "分组",
    allWords: "全部单词",
    weekGroup: (n) => `每周小故事 · 第 ${n} 周`,
    otherArticles: "其他文章",
    uncategorized: "未分类",
    groupEmpty: "这个分组里还没有单词。",
    select: "选择",
    exitSelect: "完成",
    selectedCount: (n) => `已选择 ${n} 个`,
    deleteSelected: "删除所选",
    clearSelection: "清除选择",
    nothingSelected: "请先选择要删除的单词。",
    confirmTitle: "确认删除",
    confirmSingle: (word) => `确定要删除“${word}”吗？此操作无法撤销。`,
    confirmBatch: (n) => `确定要删除选中的 ${n} 个单词吗？此操作无法撤销。`,
    confirmDelete: "删除",
    cancel: "取消",
    phraseBadge: "词组",
    myMeaningLabel: "我的释义",
    dictionaryMeaningLabel: "词典释义",
    addMeaning: "✎ 写下我的中文意思",
    editMeaning: "✎ 修改",
    noMeaning: "还没有中文意思，写一个吧。",
    practiceCta: "🎧 去听写练习 →",
  },
  dictation: {
    title: "听写练习",
    subtitle: "看中文，写出对应的英文单词或词组。",
    intro: "把生词本里的词练一练：屏幕上出现中文意思，你把英文拼出来。",
    start: "开始练习 →",
    prompt: "这个中文意思对应的英文是什么？",
    inputPlaceholder: "在这里输入英文",
    check: "检查",
    next: "下一个 →",
    finish: "看看结果 →",
    reveal: "不会，看答案",
    correct: "拼对啦！🎉",
    wrong: "还差一点，看看正确写法～",
    answerLabel: "正确写法",
    hint: "提示",
    showHint: "看提示",
    letters: (n) => `一共 ${n} 个字母`,
    phraseBadge: "词组",
    progress: (cur, total) => `第 ${cur} / ${total} 个`,
    result: (score, total) => `本轮完成：${score} / ${total} 个`,
    resultPerfect: "全部拼对，太棒了！🏆",
    resultGood: "很不错，再练一轮会更熟哦！👍",
    resultTry: "没关系，多写几遍就记住了～💪",
    again: "再来一轮",
    practiceWrong: "只练刚才写错的",
    play: "🔊 听一听",
    empty: "生词本里还没有可以练习的词。",
    emptyHint: "打开一篇文章，点击单词或选中词组，保存到生词本就能来练习了。",
    goVocabulary: "去生词本",
    needMeaning: (n) =>
      `还有 ${n} 个词没有中文意思，去生词本写上意思就能一起练啦。`,
    scopeLabel: "练习范围",
    allWords: "全部生词",
    ready: (n) => `可以练习 ${n} 个词。`,
  },
  myArticles: {
    title: "我的文章",
    subtitle: "把想读的英文段落贴进来，就能像其他文章一样点词、选词组、听朗读。",
    homeHeading: "我的文章",
    homeHint: "贴一段自己想读的英文，马上开始阅读。",
    add: "+ 添加文章",
    titleLabel: "标题",
    titlePlaceholder: "给这篇文章起个名字",
    textLabel: "英文内容",
    textPlaceholder: "把英文段落粘贴到这里…",
    save: "保存",
    cancel: "取消",
    edit: "编辑",
    remove: "删除",
    confirmTitle: "确认删除",
    confirmDelete: (title) => `确定要删除“${title}”吗？此操作无法撤销。`,
    confirmYes: "删除",
    empty: "还没有添加自己的文章。",
    emptyHint: "点上面的按钮，把一段英文贴进来试试。",
    read: "开始阅读 →",
    sentenceCount: (n) => `${n} 句`,
    needTitle: "请先给文章起个标题。",
    needText: "请先粘贴一段英文内容。",
    deviceNoteZh: "自己添加的文章只保存在当前设备和浏览器。",
    deviceNoteEn: "Your own articles are saved only on this device and browser.",
    notFound: "找不到这篇文章，可能已经被删除了。",
    back: "← 我的文章",
    readerNote:
      "这是你自己添加的文章：可以点词查释义、选词组、朗读；暂时没有中文翻译和语法讲解。",
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
  nav: { topics: "Topics", vocabulary: "Vocabulary", dictation: "Dictation" },
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
    phrase: "Phrase",
    phraseNoEntry:
      "This phrase is not in the dictionary yet — you can write your own meaning.",
    phraseParts: "Word by word",
    extendLeft: "← Add word on the left",
    extendRight: "Add word on the right →",
    shrinkLeft: "Remove left word →",
    shrinkRight: "← Remove right word",
    extendHint:
      "Learning a phrase? Add or remove one word at either edge below.",
    resetSelection: "Just this word",
    myMeaning: "My meaning",
    dictionaryMeaning: "Dictionary",
    addMeaning: "✎ Write my own meaning",
    editMeaning: "✎ Edit my meaning",
    meaningPlaceholder: "Write the Chinese meaning in your own words",
    saveMeaning: "Save",
    cancelMeaning: "Cancel",
    clearMeaning: "Clear",
    meaningSavesWord: "Saving a meaning also adds this to your vocabulary.",
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
    deviceNoteZh: "生词仅保存在当前设备和浏览器。",
    deviceNoteEn: "Vocabulary is saved only on this device and browser.",
    filterLabel: "Group",
    allWords: "All words",
    weekGroup: (n) => `Weekly Stories · Week ${n}`,
    otherArticles: "Other articles",
    uncategorized: "Uncategorized",
    groupEmpty: "No words in this group yet.",
    select: "Select",
    exitSelect: "Done",
    selectedCount: (n) => `${n} selected`,
    deleteSelected: "Delete selected",
    clearSelection: "Clear selection",
    nothingSelected: "Select some words to delete first.",
    confirmTitle: "Confirm delete",
    confirmSingle: (word) =>
      `Delete "${word}"? This cannot be undone.`,
    confirmBatch: (n) =>
      `Delete the ${n} selected ${n === 1 ? "word" : "words"}? This cannot be undone.`,
    confirmDelete: "Delete",
    cancel: "Cancel",
    phraseBadge: "Phrase",
    myMeaningLabel: "My meaning",
    dictionaryMeaningLabel: "Dictionary",
    addMeaning: "✎ Write my own meaning",
    editMeaning: "✎ Edit",
    noMeaning: "No meaning yet — write one.",
    practiceCta: "🎧 Practice dictation →",
  },
  dictation: {
    title: "Dictation",
    subtitle: "See the Chinese meaning, then write the English word or phrase.",
    intro:
      "Practise the words in your notebook: a Chinese meaning appears, and you spell the English.",
    start: "Start practising →",
    prompt: "Which English word or phrase means this?",
    inputPlaceholder: "Type the English here",
    check: "Check",
    next: "Next →",
    finish: "See your result →",
    reveal: "Show me the answer",
    correct: "That's it! 🎉",
    wrong: "Almost — here is the right spelling.",
    answerLabel: "Correct spelling",
    hint: "Hint",
    showHint: "Show a hint",
    letters: (n) => `${n} letters in all`,
    phraseBadge: "Phrase",
    progress: (cur, total) => `${cur} / ${total}`,
    result: (score, total) => `Round finished: ${score} / ${total}`,
    resultPerfect: "Every one correct — amazing! 🏆",
    resultGood: "Nice work! One more round will make it stick. 👍",
    resultTry: "No worries — write them a few more times. 💪",
    again: "Another round",
    practiceWrong: "Practise the ones I missed",
    play: "🔊 Listen",
    empty: "No words to practise yet.",
    emptyHint:
      "Open an article, tap a word or select a phrase, and save it to your vocabulary.",
    goVocabulary: "Go to vocabulary",
    needMeaning: (n) =>
      `${n} ${n === 1 ? "item has" : "items have"} no meaning yet — add one in your vocabulary to practise ${n === 1 ? "it" : "them"}.`,
    scopeLabel: "Practise",
    allWords: "All words",
    ready: (n) => `${n} ${n === 1 ? "item" : "items"} ready to practise.`,
  },
  myArticles: {
    title: "My Articles",
    subtitle:
      "Paste in an English passage you want to read, then tap words, build phrases, and listen just like any other article.",
    homeHeading: "My Articles",
    homeHint: "Paste an English passage of your own and start reading.",
    add: "+ Add an article",
    titleLabel: "Title",
    titlePlaceholder: "Give this article a name",
    textLabel: "English text",
    textPlaceholder: "Paste your English passage here…",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    remove: "Delete",
    confirmTitle: "Confirm delete",
    confirmDelete: (title) => `Delete "${title}"? This cannot be undone.`,
    confirmYes: "Delete",
    empty: "You haven't added any articles yet.",
    emptyHint: "Tap the button above and paste in some English to try it.",
    read: "Start reading →",
    sentenceCount: (n) => `${n} ${n === 1 ? "sentence" : "sentences"}`,
    needTitle: "Give the article a title first.",
    needText: "Paste some English text first.",
    deviceNoteZh: "自己添加的文章只保存在当前设备和浏览器。",
    deviceNoteEn: "Your own articles are saved only on this device and browser.",
    notFound: "That article could not be found — it may have been deleted.",
    back: "← My Articles",
    readerNote:
      "This is your own article: tap words, build phrases, and listen. It has no Chinese translation or grammar notes yet.",
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
