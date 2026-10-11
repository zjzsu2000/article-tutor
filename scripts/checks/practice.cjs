/**
 * Behaviour checks for saved vocabulary and practice.
 *
 * Run with ./scripts/checks/run.sh, which compiles lib/*.ts into .checks-build
 * first. Everything here is pure: no DOM, no localStorage, no network.
 *
 * These live in the repo on purpose. An earlier round kept the equivalent
 * suite in /tmp and a routine cleanup wiped the entire regression net that
 * eight review rounds had built up.
 *
 * Most of the leak assertions state the one property that kept failing during
 * review: *nothing visible before answering may be graded correct*. Several
 * are written as a pair — "copying this would be graded correct" AND "so it
 * is not shown" — because the bug was always the gap between those two.
 */
const path = require("path");
const dir = process.env.BUILD_DIR || path.join(__dirname, "..", "..", ".checks-build");
const load = (m) => require(path.join(dir, m));

const P = load("practice");
const vocab = load("vocab");
const tokens = load("tokens");
const keys = load("keys");
const storage = load("storage");
const ctx = load("practiceContext");
const md = load("mockData");
const { weeklyDictionary } = load("weeklyDictionary");
const userArticles = load("userArticles");

let failures = 0;
let checks = 0;
const ok = (name, cond, extra) => {
  checks++;
  if (cond) return;
  failures++;
  console.log("FAIL:", name, extra === undefined ? "" : JSON.stringify(extra));
};
const section = (name) => console.log(`── ${name}`);

function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const item = (over = {}) => ({ word: "captain", translation: "船长；队长", savedAt: 1, ...over });
const ask = (it, direction, mode = "typed", pool = [], seed = 1) =>
  P.buildQuestion(it, pool, { direction, answerMode: mode }, seeded(seed));
const offered = (it, pool, direction) => {
  const seen = new Set();
  for (let seed = 1; seed <= 60; seed++) {
    const q = P.buildQuestion(it, pool, { direction, answerMode: "multiple-choice" }, seeded(seed));
    for (const c of (q && q.choices) || []) seen.add(c);
  }
  return seen;
};
const OTHERS_EN = [
  { word: "leader", translation: "领队", savedAt: 1 },
  { word: "sailor", translation: "水手", savedAt: 1 },
  { word: "baker", translation: "面包师", savedAt: 1 },
  { word: "cook", translation: "厨师", savedAt: 1 },
];
const OTHERS_ZH = [
  { word: "x1", translation: "队长", savedAt: 1 },
  { word: "x2", translation: "水手", savedAt: 1 },
  { word: "x3", translation: "面包师", savedAt: 1 },
  { word: "x4", translation: "厨师", savedAt: 1 },
];

// ─────────────────────────────────────────────────────────────────────────
section("vocabulary identity and meaning rules");

ok("vocabKey is unchanged for a single word", vocab.vocabKey("Friendship") === "friendship");
ok("vocabKey collapses whitespace for phrases", vocab.vocabKey("  Look   After ") === "look after");
ok("a stored kind wins over inference",
   vocab.vocabKind({ word: "look after", translation: "", kind: "word" }) === "word");
ok("a legacy phrase is inferred from whitespace",
   vocab.vocabKind({ word: "look after", translation: "" }) === "phrase");
ok("a legacy word is inferred too", vocab.vocabKind({ word: "cat", translation: "x" }) === "word");

const dictOnly = item();
const both = item({ userTranslation: "开船的人" });
const userOnly = item({ word: "look after", kind: "phrase", translation: "", userTranslation: "照顾" });
ok("the dictionary meaning is canonical when there is one",
   vocab.canonicalMeaning(dictOnly) === "船长；队长" && vocab.meaningSource(dictOnly) === "dictionary");
ok("a learner note never replaces a dictionary answer",
   vocab.canonicalMeaning(both) === "船长；队长" && vocab.meaningSource(both) === "dictionary");
ok("the learner's meaning is the fallback",
   vocab.canonicalMeaning(userOnly) === "照顾" && vocab.meaningSource(userOnly) === "user");
ok("display and canonical answer different questions",
   vocab.displayMeaning(both) === "开船的人" && vocab.canonicalMeaning(both) === "船长；队长");
for (const placeholder of ["这个词还没有收录，后面会补充。", "暂无释义", "No translation yet",
  "This word is not in the dictionary yet."]) {
  ok(`the placeholder "${placeholder.slice(0, 8)}…" is not a meaning`,
     vocab.canonicalMeaning({ word: "gale", translation: placeholder, savedAt: 1 }) === "");
}
ok("the unknown flag is rejected even with text",
   vocab.canonicalMeaning({ word: "gale", translation: "anything", unknown: true, savedAt: 1 }) === "");
ok("an item with no meaning is not practisable",
   !P.isPractisable({ word: "gale", translation: "", savedAt: 1 }));
ok("a user-meaning-only item is practisable", P.isPractisable(userOnly));

section("Chinese answer handling");
ok("a full multi-gloss entry is accepted", vocab.chineseAnswerMatches("船长；队长", ["船长；队长"]));
ok("gloss splitting yields each gloss",
   vocab.chineseGlosses("船长；队长").includes("船长") && vocab.chineseGlosses("船长；队长").includes("队长"));
ok("a parenthetical note is stripped for grading",
   vocab.normalizeChineseAnswer("男警察（复数 policemen）") === "男警察");
ok("full-width spaces are ignored", vocab.normalizeChineseAnswer("　船长　") === "船长");
ok("English answers are case-insensitive", vocab.answersMatch("Captain", "captain"));
ok("English answers tolerate trailing punctuation", vocab.answersMatch("captain.", "captain"));
ok("a curly apostrophe is accepted", vocab.answersMatch("don’t", "don't"));
ok("an empty answer is rejected", !vocab.answersMatch("   ", "captain"));

section("reader tokens and phrase ranges");
{
  const toks = tokens.tokenize("She had to look after her little brother, day after day.");
  const idxOf = (w) => toks.findIndex((t) => t.type === "word" && t.text === w);
  const look = idxOf("look");
  const after = tokens.neighbourWord(toks, look, 1);
  ok("a single word span is the word", tokens.spanText(toks, look, look) === "look");
  ok("a two-word span is the phrase", tokens.spanText(toks, look, after) === "look after");
  ok("a span across a comma keeps it inside",
     tokens.spanText(toks, idxOf("brother"), tokens.neighbourWord(toks, idxOf("brother"), 1)) === "brother, day");
  ok("there is no neighbour before the first word", tokens.neighbourWord(toks, idxOf("She"), -1) === null);
  ok("a contraction is one token",
     tokens.tokenize("I don't know.").filter((t) => t.type === "word").map((t) => t.text).join("|") === "I|don't|know");
  ok("a hyphenated word is one token",
     tokens.tokenize("a full-time job").filter((t) => t.type === "word").map((t) => t.text).join("|") === "a|full-time|job");
  ok("shrinking drops one word from the left",
     tokens.spanText(toks, ...Object.values(tokens.shrinkWordRange(toks, look, tokens.neighbourWord(toks, after, 1), "left"))) === "after her");
  ok("a single word cannot shrink", tokens.shrinkWordRange(toks, look, look, "left") === null);
}

section("IME-safe Enter");
ok("plain Enter commits", keys.shouldCommitOnEnter({ key: "Enter" }));
ok("Enter is ignored while composing", !keys.shouldCommitOnEnter({ key: "Enter", isComposing: true }));
ok("Enter is ignored on legacy keyCode 229", !keys.shouldCommitOnEnter({ key: "Enter", keyCode: 229 }));
ok("Enter is ignored on the tracked flag", !keys.shouldCommitOnEnter({ key: "Enter", composing: true }));
ok("other keys never commit", !keys.shouldCommitOnEnter({ key: "a" }));

section("what a question asks, and what counts as right");
{
  const en = ask(item(), "zh-to-en");
  ok("zh→en prompts with the meaning and expects the item",
     en.prompt === "船长；队长" && en.canonicalAnswer === "captain");
  ok("the English answer is graded case-insensitively", P.gradeAnswer(en, "Captain").correct);
  ok("a wrong English answer is rejected", !P.gradeAnswer(en, "sailor").correct);
  const zh = ask(item(), "en-to-zh");
  ok("en→zh prompts with the item and expects the meaning",
     zh.prompt === "captain" && zh.canonicalAnswer === "船长；队长");
  ok("any single gloss is accepted", P.gradeAnswer(zh, "队长").correct);
  ok("a wrong meaning is rejected", !P.gradeAnswer(zh, "水手").correct);
  const noted = ask(item({ userTranslation: "开船的人" }), "en-to-zh");
  ok("the canonical answer stays the dictionary meaning", noted.canonicalAnswer === "船长；队长");
  ok("the learner's own wording is still accepted", P.gradeAnswer(noted, "开船的人").correct);
  ok("en→zh keeps that wording out of the question (it is an answer there)",
     noted.learnerNote === undefined);
  ok("zh→en shows it as a note instead",
     ask(item({ userTranslation: "开船的人" }), "zh-to-en").learnerNote === "开船的人");
}

section("the form the learner met");
{
  const admired = item({
    word: "admire", translation: "钦佩；赞赏", encounteredText: "admired",
    sourceSentence: "I have admired this group for years.",
  });
  ok("the lemma stays the saved word", admired.word === "admire");
  ok("encounteredForm returns the met form", vocab.encounteredForm(admired) === "admired");
  ok("a legacy item falls back to the lemma",
     vocab.encounteredForm({ word: "admire", translation: "钦佩" }) === "admire");
  ok("a contextual question expects the met form", P.practiceEnglishAnswer(admired) === "admired");
  ok("without context the lemma is expected",
     P.practiceEnglishAnswer(item({ word: "admire", translation: "钦佩", encounteredText: "admired" })) === "admire");
  const q = ask(admired, "zh-to-en");
  ok("zh→en asks for the met form", q.canonicalAnswer === "admired");
  ok("the met form is graded correct", P.gradeAnswer(q, "admired").correct);
  ok("the lemma is NOT accepted where the context demands the inflection",
     !P.gradeAnswer(q, "admire").correct);
  ok("the context hides the met form",
     q.maskedSentence === "I have ________ this group for years." && q.contextMasked === true);
  ok("the shown context never contains the answer",
     !P.containsWord(q.maskedSentence, q.canonicalAnswer));
  const plural = item({ word: "shoe", translation: "鞋", encounteredText: "shoes",
    sourceSentence: "He put on his shoes and ran." });
  const pq = ask(plural, "zh-to-en");
  ok("a plural encounter is asked as the plural", pq.canonicalAnswer === "shoes");
  ok("and the plural is masked", pq.maskedSentence === "He put on his ________ and ran.");
  const phrase = item({ word: "look forward to", kind: "phrase", translation: "期待",
    encounteredText: "looked forward to", sourceSentence: "She looked forward to seeing them again." });
  const phq = ask(phrase, "zh-to-en");
  ok("a phrase keeps its whole encountered surface", phq.canonicalAnswer === "looked forward to");
  ok("and is masked as one unit", phq.maskedSentence === "She ________ seeing them again.");
}

section("recovering context for items saved before it existed");
{
  const base = { word: "admire", translation: "钦佩；赞赏", savedAt: 1 };
  const sentence = "I have admired this group for years.";
  const complete = { ...base, sourceSentence: sentence, encounteredText: "admired" };
  ok("an item with both fields is untouched", ctx.withReadingContext(complete) === complete);
  const deployed = { ...base, sourceSentence: sentence, articleId: "weekly-7-surprise-party" };
  const fixed = ctx.withReadingContext(deployed);
  ok("the deployed shape recovers the met form from its own sentence",
     fixed.encounteredText === "admired");
  ok("and keeps the saved sentence, not another from the article",
     fixed.sourceSentence === sentence);
  ok("the recovered question then expects the met form",
     ask(fixed, "zh-to-en").canonicalAnswer === "admired");
  ok("a sentence not containing the item recovers nothing",
     ctx.withReadingContext({ ...base, sourceSentence: "She went home early." }).encounteredText === undefined);
  ok("and that context is withheld rather than shown",
     ask(ctx.withReadingContext({ ...base, sourceSentence: "She went home early." }), "zh-to-en").contextWithheld === true);
  const legacy = ctx.withReadingContext({ ...base, articleId: "weekly-7-surprise-party" });
  ok("a pre-context item recovers both fields from its article",
     legacy.encounteredText === "admired" && /admired/.test(legacy.sourceSentence || ""));
  ok("an item with no article and no sentence is left alone",
     ctx.withReadingContext(base).sourceSentence === undefined);
  ok("an item its article no longer contains is left alone",
     ctx.withReadingContext({ ...base, word: "beautiful", articleId: "weekly-7-surprise-party" })
       .sourceSentence === undefined);
  ok("recovery returns the matched surface, not the lemma",
     P.findWordMatch("I look-forward-to it.", "look forward to") === "look-forward-to");
  // ...and the recovery path must actually use it: returning the lemma here
  // would make the question expect a spelling the sentence never showed, and
  // mark the one the learner did see wrong.
  {
    const found = P.findEncounter(["I look-forward-to it."], "look forward to",
      () => undefined, tokens.tokenize);
    ok("findEncounter keeps the punctuation the sentence used",
       found && found.encountered === "look-forward-to", found);
    const recovered = ctx.withReadingContext({ word: "look forward to", kind: "phrase",
      translation: "期待", savedAt: 1, sourceSentence: "I look-forward-to it." });
    ok("withReadingContext records that surface, not the lemma",
       recovered.encounteredText === "look-forward-to", recovered.encounteredText);
    const rq = ask(recovered, "zh-to-en");
    ok("the question then expects what the sentence showed",
       rq.canonicalAnswer === "look-forward-to");
    ok("and typing that is graded correct", P.gradeAnswer(rq, "look-forward-to").correct);
    ok("case-only recovery keeps the sentence's casing",
       (P.findEncounter(["Captain Ahab waved."], "captain", () => undefined, tokens.tokenize) || {})
         .encountered === "Captain");
  }
  ok("recovery keeps the sentence's casing", P.findWordMatch("Captain Ahab waved.", "captain") === "Captain");
}

section("masking and context safety");
{
  const m = P.maskTarget;
  ok("a single word is masked", m("I read a book on the train.", "book").text === "I read a ________ on the train.");
  ok("masking is case-insensitive", m("Book a room, please.", "book").text === "________ a room, please.");
  ok("a phrase is masked as one unit",
     m("I look forward to seeing you again.", "look forward to").text === "I ________ seeing you again.");
  ok("a longer word is not masked", m("I booked a room and then read a book.", "book").text
     === "I booked a room and then read a ________.");
  ok("a possessive is not masked as the bare word", m("The book's cover is red.", "book").masked === false);
  ok("every occurrence is masked", m("A book is a book.", "book").text === "A ________ is a ________.");
  ok("an absent target reports masked:false", m("Nothing to see here.", "book").masked === false);
  ok("a curly-apostrophe spelling is found", P.containsWord("I don’t know", "don't"));
  ok("a left-curly-apostrophe spelling is found", P.containsWord("I don‘t know", "don't"));
  ok("a punctuation-separated phrase is found", P.containsWord("say look/forward/to now", "look forward to"));
  ok("a full-width spelling is masked as the same English answer",
     P.maskTarget("The ｃａｐｔａｉｎ waved.", "captain").text === "The ________ waved.");
  const unmaskable = ask(item({ word: "admire", translation: "钦佩",
    sourceSentence: "She admired them for years." }), "zh-to-en");
  ok("a zh→en context that cannot be masked is withheld, never shown raw",
     unmaskable.contextWithheld === true && unmaskable.maskedSentence === undefined);
  ok("the withheld sentence is still kept for the last rung",
     unmaskable.sourceSentence === "She admired them for years." &&
     unmaskable.hints.indexOf("unmasked-context") > unmaskable.hints.indexOf("answer"));
  const enZh = ask(item({ sourceSentence: "An old sea captain had been hurt." }), "en-to-zh");
  ok("en→zh shows a clean sentence unmasked",
     enZh.contextWithheld === false && enZh.maskedSentence === "An old sea captain had been hurt.");
  ok("a one-letter answer offers no first-letter rung",
     !ask(item({ word: "I", translation: "我" }), "zh-to-en").hints.includes("letters"));
  ok("a normal answer still offers it", ask(item(), "zh-to-en").hints.includes("letters"));
  ok("the letters hint hides everything after the first letter",
     P.letterHint("look after") === "l___ a____");
}

section("nothing visible before answering may be graded correct");
{
  // A Chinese gloss that spells out the English form. Four real dictionary
  // entries do this ("男警察（复数 policemen）").
  const policeman = { word: "policeman", translation: "男警察（复数 policemen）", savedAt: 1,
    encounteredText: "policemen", sourceSentence: "Two policemen came to the door." };
  const q = ask(policeman, "zh-to-en");
  ok("the answer is masked out of the Chinese prompt", !P.containsWord(q.prompt, q.canonicalAnswer), q.prompt);
  ok("the prompt keeps its Chinese meaning readable", q.prompt.startsWith("男警察"));
  ok("the lemma is masked out too", !P.containsWord(q.prompt, "policeman"));
  const noted = { word: "admire", translation: "钦佩", userTranslation: "admired 是它的过去式", savedAt: 1 };
  ok("the learner's note is masked in zh→en",
     !P.containsWord(ask(noted, "zh-to-en").learnerNote || "", "admire"));
  const leftCurly = ask({ word: "don't", translation: "不要 don‘t", savedAt: 1 }, "zh-to-en");
  ok("a left-curly-apostrophe answer is masked out of the prompt",
     leftCurly && !leftCurly.prompt.includes("don‘t") &&
       !P.containsWord(leftCurly.prompt, "don't"), leftCurly && leftCurly.prompt);
  const leftCurlyNote = ask({ word: "don't", translation: "不要",
    userTranslation: "也可以写成 don‘t", savedAt: 1 }, "zh-to-en");
  ok("a left-curly-apostrophe answer is masked out of the learner note",
     leftCurlyNote && !leftCurlyNote.learnerNote.includes("don‘t") &&
       !P.containsWord(leftCurlyNote.learnerNote, "don't"), leftCurlyNote && leftCurlyNote.learnerNote);
  ok("an all-English gloss yields no zh→en question",
     ask({ word: "gale", translation: "gale", savedAt: 1 }, "zh-to-en") === null);
  ok("and none in en→zh either (the prompt would be the answer)",
     ask({ word: "gale", translation: "gale", savedAt: 1 }, "en-to-zh") === null);
  ok("a prompt left with only punctuation is rejected",
     ask({ word: "gale", translation: "gale!", savedAt: 1 }, "zh-to-en") === null);
  ok("a meaning that normalizes to nothing gives no en→zh question",
     ask({ word: "captain", translation: "（captain）", savedAt: 1 }, "en-to-zh") === null);

  // Grading DROPS a parenthetical note, so "男警察" alone answers
  // "男警察（复数 policemen）" — and a context showing just that much is a
  // leak that a bracket-preserving comparison would miss entirely.
  {
    const withNote = { word: "policeman", translation: "男警察（复数 policemen）", savedAt: 1,
      sourceSentence: "The policeman（男警察）arrived." };
    const bq = ask(withNote, "en-to-zh");
    ok("typing the gloss without its bracketed note is graded correct",
       P.gradeAnswer(bq, "男警察").correct);
    ok("so a context showing only that much is withheld",
       bq.contextWithheld === true && bq.maskedSentence === undefined);
    ok("revealsChineseAnswer reduces candidates the way grading does",
       P.revealsChineseAnswer("The policeman（男警察）arrived.", ["男警察（复数 policemen）"]));
    ok("and it still catches an answer written out in brackets",
       P.revealsChineseAnswer("Captain means 船[长].", ["船[长]"]));
  }

  // Learner-authored punctuation: grading keeps :[]【】, so leak detection must.
  for (const meaning of ["船：长", "船[长]", "船【旧】长", "船（旧）长", "船:长"]) {
    const it = { word: "captain", translation: "", userTranslation: meaning, savedAt: 1,
      sourceSentence: `Captain means ${meaning}.` };
    const bq = ask(it, "en-to-zh");
    ok(`copying "${meaning}" would be graded correct`, bq !== null && P.gradeAnswer(bq, meaning).correct);
    ok(`so the context showing "${meaning}" is withheld`,
       bq.contextWithheld === true && bq.maskedSentence === undefined);
  }
  ok("a bilingual sentence showing the answer is withheld",
     ask(item({ sourceSentence: "The captain（船长）stood by the door." }), "en-to-zh").contextWithheld === true);
  const fullWidthPrompt = ask({ word: "captain", translation: "船长 ｃａｐｔａｉｎ", savedAt: 1 }, "zh-to-en");
  ok("a full-width copy of the English answer is masked out of the prompt",
     fullWidthPrompt && !/ｃａｐｔａｉｎ/.test(fullWidthPrompt.prompt) &&
       !P.containsWord(fullWidthPrompt.prompt, "captain"), fullWidthPrompt && fullWidthPrompt.prompt);
  const fullWidthContext = ask({ word: "captain", translation: "船长", encounteredText: "captain",
    sourceSentence: "The captain greeted ｃａｐｔａｉｎ.", savedAt: 1 }, "zh-to-en");
  ok("every full-width copy is masked out of displayed context",
     fullWidthContext && fullWidthContext.contextWithheld === false &&
       fullWidthContext.maskedSentence === "The ________ greeted ________.",
     fullWidthContext && fullWidthContext.maskedSentence);
  ok("a bilingual selection whose prompt carries the answer is rejected",
     ask({ word: "captain（船长）stood", kind: "phrase", translation: "", userTranslation: "船长", savedAt: 1 },
       "en-to-zh") === null);
  ok("leakNormalize reduces text the way grading does",
     P.leakNormalize("船：长") === vocab.normalizeChineseAnswer("船：长"));
  ok("and still keeps bracket contents that grading would drop",
     P.leakNormalize("The captain（船长）stood.").includes("船长"));

  // Item metadata is screened, never rendered raw.
  const pos = (partOfSpeech, direction) =>
    (ask({ word: "captain", translation: "船长", partOfSpeech, savedAt: 1 }, direction) || {}).partOfSpeech;
  ok("a part of speech holding the English answer is dropped", pos("captain", "zh-to-en") === undefined);
  ok("a part of speech holding the Chinese answer is dropped", pos("船长", "en-to-zh") === undefined);
  ok("a normal part of speech survives", pos("n.", "zh-to-en") === "n." && pos("n.", "en-to-zh") === "n.");
  ok("a bilingual met form is dropped in en→zh",
     (ask({ word: "captain", translation: "船长", encounteredText: "captain（船长）", savedAt: 1 },
       "en-to-zh") || {}).metAs === undefined);

  // Malformed storage must not crash or bypass screening.
  for (const bad of [42, null, {}, [], true]) {
    let threw = false, built = null;
    try { built = ask({ word: "captain", translation: "船长", partOfSpeech: bad, savedAt: 1 }, "zh-to-en"); }
    catch (e) { threw = true; }
    ok(`a ${Array.isArray(bad) ? "array" : typeof bad} part of speech neither crashes nor shows`,
       !threw && built !== null && built.partOfSpeech === undefined);
  }
  const cleaned = storage.normalizeSavedWord({ word: "captain", translation: "船长", savedAt: 1,
    partOfSpeech: 42, pronunciation: {}, example: null, articleTitle: ["x"] });
  ok("loading drops non-string metadata",
     cleaned.partOfSpeech === undefined && cleaned.pronunciation === undefined &&
     cleaned.example === undefined && cleaned.articleTitle === undefined);
  ok("loading keeps well-formed metadata",
     storage.normalizeSavedWord({ word: "captain", translation: "船长", savedAt: 1, partOfSpeech: "n." })
       .partOfSpeech === "n.");
}

section("multiple choice: no option may be defensible-but-wrong");
{
  const pool = [item(), { word: "sailor", translation: "水手；海员", savedAt: 1 },
    { word: "baker", translation: "面包师", savedAt: 1 },
    { word: "look after", kind: "phrase", translation: "", userTranslation: "照顾", savedAt: 1 },
    { word: "Captain", translation: "船长；队长", savedAt: 1 }];
  const mc = ask(pool[0], "zh-to-en", "multiple-choice", pool, 7);
  ok("choices are built", mc.answerMode === "multiple-choice" && mc.choices.length >= P.MIN_CHOICES);
  ok("the answer appears exactly once", mc.choices.filter((c) => c === "captain").length === 1);
  ok("choices are unique after normalization",
     new Set(mc.choices.map(vocab.normalizeAnswer)).size === mc.choices.length);
  ok("a case-variant duplicate is never offered", !mc.choices.includes("Captain"));
  ok("choices never exceed the cap", mc.choices.length <= P.MAX_CHOICES);
  ok("with no distractors it falls back to typing, not fake options",
     ask(pool[0], "zh-to-en", "multiple-choice", [pool[0]], 1).answerMode === "typed");
  ok("two distractors give a smaller set rather than a fallback",
     ask(pool[0], "zh-to-en", "multiple-choice", [pool[0], pool[1], pool[2]], 1).choices.length === 3);

  // Gloss overlap: typed grading accepts either, so both must never be offered.
  const overlap = [item({ translation: "船长；队长" }), { word: "leader", translation: "队长", savedAt: 1 },
    ...OTHERS_EN.slice(1)];
  ok("a gloss-sharing distractor is never offered (船长；队长 vs 队长)",
     !offered(overlap[0], overlap, "en-to-zh").has("队长"));
  const twins = [{ word: "captain", translation: "船长", savedAt: 1 },
    { word: "leader", translation: "队长；领队", savedAt: 1 },
    { word: "chief", translation: "领队", savedAt: 1 }, ...OTHERS_EN.slice(2)];
  const twinChoices = offered(twins[0], twins, "en-to-zh");
  ok("two distractors sharing a gloss never both appear",
     !(twinChoices.has("队长；领队") && twinChoices.has("领队")));
  const contains = [{ word: "captain", translation: "船长", savedAt: 1 },
    { word: "old captain", kind: "phrase", translation: "老船长", savedAt: 1 }, ...OTHERS_EN.slice(1)];
  ok("an option containing the answer is never offered (老船长 vs 船长)",
     !offered(contains[0], contains, "en-to-zh").has("老船长"));

  // Echoes of anything on screen.
  const echo = [{ word: "captain", translation: "", userTranslation: "leader", savedAt: 1 }, ...OTHERS_EN];
  ok("an option identical to the prompt is never offered", !offered(echo[0], echo, "zh-to-en").has("leader"));
  const mixed = [{ word: "captain", translation: "", userTranslation: "队长 leader 或 chief", savedAt: 1 }, ...OTHERS_EN];
  ok("an English word inside a mixed-script prompt is not offered",
     !offered(mixed[0], mixed, "zh-to-en").has("leader"));
  const withNote = [{ word: "captain", translation: "船长", userTranslation: "我的说法 leader 或 chief", savedAt: 1 }, ...OTHERS_EN];
  ok("an English word inside the visible learner note is not offered",
     !offered(withNote[0], withNote, "zh-to-en").has("leader"));
  const ctxEcho = [{ word: "captain", translation: "船长", encounteredText: "captain",
    sourceSentence: "The captain hugged the leader.", savedAt: 1 }, ...OTHERS_EN];
  ok("an English word visible in the context is not offered",
     !offered(ctxEcho[0], ctxEcho, "zh-to-en").has("leader"));
  const posEcho = [{ word: "captain", translation: "船长", partOfSpeech: "leader", savedAt: 1 }, ...OTHERS_EN];
  ok("an English word visible as the part of speech is not offered",
     !offered(posEcho[0], posEcho, "zh-to-en").has("leader"));
  const zhCtx = [{ word: "captain", translation: "船长", sourceSentence: "The captain greeted 队长.", savedAt: 1 }, ...OTHERS_ZH];
  ok("a Chinese word visible in an en→zh context is not offered",
     !offered(zhCtx[0], zhCtx, "en-to-zh").has("队长"));
  const zhMet = [{ word: "captain", translation: "船长", encounteredText: "captain（队长）", savedAt: 1 }, ...OTHERS_ZH];
  ok("a Chinese word visible in the met form is not offered",
     !offered(zhMet[0], zhMet, "en-to-zh").has("队长"));
  const longRun = [{ word: "captain队长和水手", translation: "船长", savedAt: 1 }, ...OTHERS_ZH];
  const longChoices = offered(longRun[0], longRun, "en-to-zh");
  ok("options copied from inside a longer visible Chinese run are not offered",
     !longChoices.has("队长") && !longChoices.has("水手"), [...longChoices]);
  const multiGlossContext = [{ word: "captain", translation: "船长",
    sourceSentence: "The captain greeted 老队长.", savedAt: 1 },
    { word: "leader", translation: "队长；领队", savedAt: 1 },
    { word: "sailor", translation: "水手", savedAt: 1 },
    { word: "baker", translation: "面包师", savedAt: 1 },
    { word: "cook", translation: "厨师", savedAt: 1 }];
  ok("a multi-gloss option containing a visible Chinese span is not offered",
     !offered(multiGlossContext[0], multiGlossContext, "en-to-zh").has("队长；领队"));
  // zh→en options are item *words*, so the echoed option has to be an item
  // whose word is the full-width character visible in the prompt. (An earlier
  // version of this assertion put it in the translation, where it could never
  // be offered — it passed without testing anything.)
  const fullWidth = [{ word: "captain", translation: "船长 Ａ", savedAt: 1 },
    { word: "Ａ", translation: "甲", savedAt: 1 },
    { word: "sailor", translation: "水手", savedAt: 1 },
    { word: "baker", translation: "面包师", savedAt: 1 },
    { word: "cook", translation: "厨师", savedAt: 1 }];
  const fwChoices = offered(fullWidth[0], fullWidth, "zh-to-en");
  ok("a full-width echo of the prompt is not offered", !fwChoices.has("Ａ"), [...fwChoices]);
  ok("but the other options still are", fwChoices.has("sailor") && fwChoices.has("baker"));
  const mixedWidth = [{ word: "captain", translation: "船长 leadｅｒ", savedAt: 1 },
    { word: "leader", translation: "领队", savedAt: 1 },
    { word: "sailor", translation: "水手", savedAt: 1 },
    { word: "baker", translation: "面包师", savedAt: 1 },
    { word: "cook", translation: "厨师", savedAt: 1 }];
  ok("a mixed ASCII/full-width prompt echo is not offered",
     !offered(mixedWidth[0], mixedWidth, "zh-to-en").has("leader"));
  const leftCurlyChoice = [{ word: "captain", translation: "船长 don‘t", savedAt: 1 },
    { word: "don't", translation: "不要", savedAt: 1 },
    { word: "sailor", translation: "水手", savedAt: 1 },
    { word: "baker", translation: "面包师", savedAt: 1 },
    { word: "cook", translation: "厨师", savedAt: 1 }];
  ok("a left-curly-apostrophe prompt echo is not offered as a wrong option",
     !offered(leftCurlyChoice[0], leftCurlyChoice, "zh-to-en").has("don't"));

  // ...and none of that may cost legitimate options.
  const art = [{ word: "artwork", translation: "", userTranslation: "art", savedAt: 1 },
    { word: "party", translation: "聚会", savedAt: 1 }, { word: "starter", translation: "开胃菜", savedAt: 1 },
    { word: "cart", translation: "手推车", savedAt: 1 }, { word: "sailor", translation: "水手", savedAt: 1 }];
  const artChoices = offered(art[0], art, "zh-to-en");
  ok("an 'art' prompt still offers party / starter / cart",
     ["party", "starter", "cart"].every((w) => artChoices.has(w)), [...artChoices]);
}

section("rounds, ordering and stats");
{
  const weak = item({ word: "weakest", translation: "最弱" });
  const pool = [weak];
  for (let i = 1; i <= 11; i++) pool.push(item({ word: "w" + i, translation: "强" + i }));
  const statOf = (i) => (i.word === "weakest"
    ? { right: 0, wrong: 99, lastAt: 1 } : { right: 9, wrong: 0, lastAt: 1 });
  const picked = new Set();
  for (let seed = 1; seed <= 25; seed++) {
    picked.add(P.buildRound(pool, { direction: "zh-to-en", answerMode: "typed" },
      { size: 1, statOf, rand: seeded(seed) })[0].canonicalAnswer);
  }
  ok("a size-1 round always asks the weakest item", picked.size === 1 && picked.has("weakest"), [...picked]);
  ok("presentation order is still randomized",
     new Set([1, 2, 3, 4, 5, 6].map((seed) =>
       P.buildRound(pool, { direction: "zh-to-en", answerMode: "typed" }, { size: 3, statOf, rand: seeded(seed) })
         .map((q) => q.canonicalAnswer).join(","))).size > 1);
  ok("least recently practised breaks ties",
     P.orderByWeakest([item({ word: "old" }), item({ word: "fresh" })],
       (i) => (i.word === "fresh" ? { right: 0, wrong: 0, lastAt: 0 } : { right: 0, wrong: 0, lastAt: 5 }))[0].word === "fresh");

  const rejected = { word: "gale", translation: "gale", savedAt: 1 };
  const good = [item({ word: "a1", translation: "甲" }), item({ word: "a2", translation: "乙" })];
  ok("a round refills past an item rejected for this direction",
     P.buildRound([rejected, ...good, item({ word: "a3", translation: "丙" })],
       { direction: "en-to-zh", answerMode: "typed" },
       { size: 3, statOf: (i) => (i.word === "gale" ? { right: 0, wrong: 9, lastAt: 1 } : { right: 0, wrong: 0, lastAt: 0 }),
         rand: seeded(1) }).length === 3);
  ok("a round is short, not wrong, when nothing can replace a rejected item",
     P.buildRound([rejected, ...good], { direction: "en-to-zh", answerMode: "typed" },
       { size: 3, rand: seeded(1) }).length === 2);
  ok("a scope where everything is rejected yields an empty round",
     P.buildRound([rejected], { direction: "en-to-zh", answerMode: "typed" }, { size: 3, rand: seeded(1) }).length === 0);
  ok("the round size cap is respected",
     P.buildRound(pool, { direction: "zh-to-en", answerMode: "typed" }, { size: 2, rand: seeded(4) }).length === 2);

  ok("stat keys differ per direction",
     P.practiceStatKey("captain", "zh-to-en") !== P.practiceStatKey("captain", "en-to-zh"));
  ok("stat keys normalize the item", P.practiceStatKey("  Look   After ", "zh-to-en") === P.practiceStatKey("look after", "zh-to-en"));
  const stats = { captain: { right: 5, wrong: 0, lastAt: 10 }, "captain|en-to-zh": { right: 0, wrong: 3, lastAt: 20 } };
  ok("legacy undirected history counts as zh→en",
     storage.practiceStatOf(stats, "captain", "zh-to-en").right === 5);
  ok("en→zh history comes from its own key", storage.practiceStatOf(stats, "captain", "en-to-zh").wrong === 3);
  ok("legacy history is NOT reused for en→zh",
     storage.practiceStatOf({ captain: { right: 5, wrong: 0, lastAt: 10 } }, "captain", "en-to-zh").right === 0);
  ok("an unpractised item reads as empty", storage.practiceStatOf(stats, "sailor", "zh-to-en").lastAt === 0);
}

section("learner-added articles");
{
  ok("sentences split on . ? !", userArticles.splitSentences("I like cats. Do you? Yes!").length === 3);
  ok("an abbreviation stays with its sentence",
     userArticles.splitSentences("Mr. Smith went home. He was tired.").length === 2);
  ok("a paragraph break splits", userArticles.splitSentences("One line\n\nSecond paragraph").length === 2);
  const article = userArticles.toArticle({ id: "user-x", title: "T", text: "Hi there. Bye now.", createdAt: 1 });
  ok("the adapter builds an Article with no invented level",
     article.sentences.length === 2 && article.level === undefined && article.minutes >= 1);
  ok("and leaves translation and grammar empty",
     article.sentences[0].translation === "" && article.sentences[0].grammar === "");
}

section("the real dictionary");
{
  // Counted explicitly: a predicate like `q && q.answerMode !== "mc"` treats a
  // *rejected* (null) question as a success, so a skipped entry would pass an
  // assertion named "every entry builds one".
  const tally = (entries, direction) => {
    const out = { total: entries.length, mc: 0, typed: 0, nulls: 0, fellBack: [], skipped: [] };
    for (const it of entries) {
      const q = P.buildQuestion(it, entries, { direction, answerMode: "multiple-choice" }, seeded(1));
      if (!q) { out.nulls++; out.skipped.push(it.word); continue; }
      if (q.answerMode === "multiple-choice") out.mc++;
      else { out.typed++; out.fellBack.push(it.word); }
    }
    return out;
  };
  const weeklyEntries = Object.values(weeklyDictionary).map((e) => ({ ...e, savedAt: 1 }));
  for (const direction of ["zh-to-en", "en-to-zh"]) {
    const t = tally(weeklyEntries, direction);
    ok(`every Weekly Stories entry builds a question in ${direction} (${t.total}, 0 skipped)`,
       t.nulls === 0, t.skipped);
    ok(`and every one of them is multiple choice in ${direction}`,
       t.mc === t.total && t.typed === 0, { mc: t.mc, fellBack: t.fellBack });
  }
  const all = [...Object.values(weeklyDictionary), ...Object.values(md.dictionary)]
    .map((e) => ({ ...e, savedAt: 1 }));
  const zh = tally(all, "zh-to-en");
  ok(`all ${all.length} entries build a zh→en question (0 skipped)`, zh.nulls === 0, zh.skipped);
  ok("and every zh→en question is multiple choice", zh.mc === all.length, { mc: zh.mc, fellBack: zh.fellBack });
  const en = tally(all, "en-to-zh");
  ok(`all ${all.length} entries build an en→zh question (0 skipped)`, en.nulls === 0, en.skipped);
  ok("exactly one en→zh entry falls back to typing, and it is 'sense'",
     en.typed === 1 && en.fellBack[0] === "sense", { typed: en.typed, fellBack: en.fellBack });
  ok("and 'sense' falls back for the right reason (its gloss repeats the prompt)",
     P.containsWord(md.dictionary["sense"].translation, "sense"));

  // Nothing on any pre-answer surface may be an answer, for any real entry,
  // in either direction, whether met as the lemma or as an embedded form.
  const leaks = [];
  let swept = 0;
  for (const entry of [...Object.values(weeklyDictionary), ...Object.values(md.dictionary)]) {
    const embedded = ((entry.translation || "").match(/[A-Za-z][A-Za-z'-]{2,}/g) || [])
      .find((w) => w.toLowerCase() !== entry.word.toLowerCase());
    const shapes = [{ ...entry, savedAt: 1 }];
    if (embedded) {
      shapes.push({ ...entry, savedAt: 1, encounteredText: embedded, sourceSentence: `They ${embedded} it.` });
    }
    for (const shape of shapes) {
      for (const direction of ["zh-to-en", "en-to-zh"]) {
        const q = P.buildQuestion(shape, [], { direction, answerMode: "typed" }, seeded(1));
        if (!q) continue;
        swept++;
        const surfaces = [q.prompt, q.learnerNote, q.maskedSentence, q.partOfSpeech,
          direction === "en-to-zh" ? q.metAs : null].filter(Boolean);
        for (const surface of surfaces) {
          const leaked = direction === "zh-to-en"
            ? P.containsWord(surface, q.canonicalAnswer)
            : P.revealsChineseAnswer(surface, q.acceptedAnswers);
          if (leaked) leaks.push(`${entry.word} [${direction}] ${surface}`);
        }
      }
    }
  }
  ok(`no dictionary entry leaks its answer before answering (${swept} questions swept)`,
     leaks.length === 0, leaks.slice(0, 3));
}

console.log(
  failures === 0
    ? `\nALL CHECKS PASSED (${checks} assertions)`
    : `\n${failures} of ${checks} CHECKS FAILED`
);
process.exit(failures === 0 ? 0 : 1);
