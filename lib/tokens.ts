// Sentence tokenization and token-range helpers for the reader.
//
// Kept out of the component so the word/phrase selection logic is plain,
// testable data handling. `tokenize` is unchanged from the version that has
// always powered tap-a-word lookup.

export type Token = { type: "word"; text: string } | { type: "sep"; text: string };

// The text of a token range, as the learner sees it: inner separators kept
// (so "don't" and hyphenated words survive), whitespace collapsed, and
// surrounding punctuation trimmed off the ends.
export function spanText(tokens: Token[], start: number, end: number): string {
  return tokens
    .slice(start, end + 1)
    .map((tok) => tok.text)
    .join("")
    .replace(/\s+/g, " ")
    .replace(/^[^A-Za-z]+|[^A-Za-z']+$/g, "")
    .trim();
}

// Index of the nearest word token on one side of `from`, or null at the edge.
export function neighbourWord(
  tokens: Token[],
  from: number,
  step: -1 | 1
): number | null {
  for (let i = from + step; i >= 0 && i < tokens.length; i += step) {
    if (tokens[i].type === "word") return i;
  }
  return null;
}

// Remove one word from either edge of a multi-word token range. Returning
// null keeps callers from shrinking a single word or producing an invalid
// range. The original anchor is intentionally not involved: a learner may
// correct either boundary, while Reset in the reader still returns to the
// word they first tapped.
export function shrinkWordRange(
  tokens: Token[],
  start: number,
  end: number,
  side: "left" | "right"
): { start: number; end: number } | null {
  if (start >= end) return null;
  if (side === "left") {
    const next = neighbourWord(tokens, start, 1);
    return next !== null && next <= end ? { start: next, end } : null;
  }
  const next = neighbourWord(tokens, end, -1);
  return next !== null && next >= start ? { start, end: next } : null;
}

export function tokenize(sentence: string): Token[] {
  const out: Token[] = [];
  const regex = /([A-Za-z][A-Za-z'-]*)|([^A-Za-z]+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(sentence)) !== null) {
    if (m[1]) out.push({ type: "word", text: m[1] });
    else if (m[2]) out.push({ type: "sep", text: m[2] });
  }
  return out;
}
