/**
 * Keyboard helpers that have to be right on IME keyboards.
 *
 * Typing Chinese goes through an input method: the learner types pinyin,
 * candidates appear, and Enter *confirms a candidate* rather than submitting
 * anything. Acting on that Enter would submit a half-finished answer or skip
 * to the next question. Browsers signal the composition differently, so all
 * three known signals are checked:
 *
 * - `isComposing` on the native KeyboardEvent (the standard, Chrome/Firefox)
 * - `keyCode === 229`, the legacy WebKit/Android "composition in progress"
 *   code, still what some iOS and HarmonyOS browsers report
 * - a flag the caller tracks from `compositionstart` / `compositionend`, for
 *   browsers that fire the events but set neither of the above
 *
 * Pure so the rule can be tested without a DOM.
 */
export type EnterKeyState = {
  key: string;
  /** From the native KeyboardEvent. */
  isComposing?: boolean;
  /** From the native KeyboardEvent; 229 means "the IME is handling this". */
  keyCode?: number;
  /** Tracked by the caller between compositionstart and compositionend. */
  composing?: boolean;
};

export function shouldCommitOnEnter(event: EnterKeyState): boolean {
  if (event.key !== "Enter") return false;
  if (event.composing) return false;
  if (event.isComposing) return false;
  if (event.keyCode === 229) return false;
  return true;
}
