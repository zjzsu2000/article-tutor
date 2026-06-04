import type { Question, QuestionType } from "./types";

// Logical groups used when building a Challenge attempt. Each attempt tries
// to draw one question from each group, in this order.
export const QUESTION_GROUPS = ["vocabulary", "comprehension", "grammar"] as const;
export type QuestionGroup = (typeof QUESTION_GROUPS)[number];

const TYPE_TO_GROUP: Record<QuestionType, QuestionGroup> = {
  vocabulary: "vocabulary",
  detail: "comprehension",
  main_idea: "comprehension",
  grammar: "grammar",
  tense: "grammar",
  singular_plural: "grammar",
  comparative: "grammar",
};

export const DEFAULT_ATTEMPT_SIZE = 3;

function groupOf(q: Question): QuestionGroup {
  return TYPE_TO_GROUP[q.type];
}

// A question is usable only if it has a real 4-way choice and a correct
// answer that is actually one of the options. This keeps malformed seed data
// from ever reaching the UI.
function isValid(q: Question): boolean {
  return (
    Array.isArray(q.options) &&
    q.options.length >= 2 &&
    q.options.includes(q.correctAnswer)
  );
}

// Pick one random element, preferring items whose id is not in `recentIds`.
// Falls back to the full pool when every candidate was used recently, so we
// never fail to fill a slot just because history is full.
function pickPreferringFresh(
  pool: Question[],
  recentIds: Set<string>,
  rand: () => number
): Question | null {
  if (pool.length === 0) return null;
  const fresh = pool.filter((q) => !recentIds.has(q.id));
  const from = fresh.length > 0 ? fresh : pool;
  return from[Math.floor(rand() * from.length)] ?? null;
}

/**
 * Build a single Challenge attempt from an article's full question bank.
 *
 * - Draws at most one question per group (vocabulary → comprehension →
 *   grammar), skipping groups the article has no questions for.
 * - Prefers questions not in `recentIds` to reduce repeats across attempts.
 * - Backfills from the remaining pool until `size` is reached (or the bank
 *   is exhausted), so articles still yield a full-size attempt even when a
 *   group is missing.
 *
 * Pure and deterministic given `rand`; pass a seeded RNG in tests.
 */
export function selectAttempt(
  quiz: Question[] | undefined,
  recentIds: Iterable<string> = [],
  size: number = DEFAULT_ATTEMPT_SIZE,
  rand: () => number = Math.random
): Question[] {
  const bank = (quiz ?? []).filter(isValid);
  if (bank.length === 0) return [];

  const recent = new Set(recentIds);
  const chosen: Question[] = [];
  const used = new Set<string>();

  // One per group, in declared order.
  for (const group of QUESTION_GROUPS) {
    if (chosen.length >= size) break;
    const pool = bank.filter((q) => groupOf(q) === group && !used.has(q.id));
    const pick = pickPreferringFresh(pool, recent, rand);
    if (pick) {
      chosen.push(pick);
      used.add(pick.id);
    }
  }

  // Backfill from whatever is left to reach the target size.
  while (chosen.length < size) {
    const pool = bank.filter((q) => !used.has(q.id));
    const pick = pickPreferringFresh(pool, recent, rand);
    if (!pick) break;
    chosen.push(pick);
    used.add(pick.id);
  }

  return chosen;
}
