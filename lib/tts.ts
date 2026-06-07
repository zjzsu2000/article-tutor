"use client";

import { useEffect, useState } from "react";

// Defaults tuned for elementary / middle-school English learners.
// TODO(v0.3): expose a small settings UI so the student (or parent) can
// pick rate (slow / normal / fast) and a preferred voice. Persist in
// localStorage. Keep the same defaults below as the "normal" preset.
const DEFAULT_RATE = 0.7;
const DEFAULT_PITCH = 1.0;
const DEFAULT_VOLUME = 1.0;

// Delay between cancel() and the next speak() to work around the well-known
// Chromium / HarmonyOS browser bug where queuing a new utterance immediately
// after cancel silently drops it. 80ms is enough in practice and short enough
// to feel instant.
const CANCEL_SETTLE_MS = 80;

type TTSState = {
  speaking: boolean;
  paused: boolean;
  // Increments on every speak / speakSequence / stop call. Consumers compare
  // against an owned id to know whether the active speech is still theirs —
  // useful for clearing per-component visual state (e.g. sentence highlight).
  sequenceId: number;
};

let state: TTSState = { speaking: false, paused: false, sequenceId: 0 };
const listeners = new Set<(s: TTSState) => void>();
let currentVoice: SpeechSynthesisVoice | null = null;
let voiceInitialized = false;

// Full-article reading plays one sentence at a time, chained on `onend`, so we
// always know the current position and can recover it if the browser's
// pause/resume is unreliable.
type SeqState = {
  id: number;
  texts: string[];
  index: number;
  rate: number;
  onProgress?: (index: number) => void;
};
let seqState: SeqState | null = null;
// Per-utterance token. Bumping it makes a previous utterance's onend/onerror a
// no-op — used when we cancel-and-restart after a failed resume.
let utterToken = 0;

function setState(patch: Partial<TTSState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l(state));
}

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice() {
  if (!ttsSupported()) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;
  currentVoice =
    voices.find((v) => v.default && v.lang === "en-US") ||
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang.startsWith("en")) ||
    null;
}

function ensureVoiceInit() {
  if (voiceInitialized || !ttsSupported()) return;
  voiceInitialized = true;
  pickVoice();
  window.speechSynthesis.addEventListener?.("voiceschanged", pickVoice);
}

function makeUtterance(text: string, rate: number) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  if (currentVoice) u.voice = currentVoice;
  u.rate = rate;
  u.pitch = DEFAULT_PITCH;
  u.volume = DEFAULT_VOLUME;
  return u;
}

// Cancel anything currently in the synth queue, then run queueFn to enqueue
// new utterances. A brief delay is inserted only if there was prior activity,
// so cold-path tap-to-speak still feels instant.
function startFresh(queueFn: () => void) {
  if (!ttsSupported()) return;
  const synth = window.speechSynthesis;
  const wasActive = synth.speaking || synth.pending || synth.paused;
  // resume() before cancel() is a defensive workaround: some browsers leave
  // the engine wedged if cancel happens while paused.
  if (synth.paused) {
    try {
      synth.resume();
    } catch {
      /* noop */
    }
  }
  synth.cancel();
  if (wasActive) {
    setTimeout(queueFn, CANCEL_SETTLE_MS);
  } else {
    queueFn();
  }
}

export function ttsSpeak(
  text: string,
  opts?: { rate?: number }
): number | null {
  if (!ttsSupported()) return null;
  ensureVoiceInit();
  const myId = state.sequenceId + 1;
  // A single-word/sentence speak supersedes any full-article sequence.
  seqState = null;
  setState({ speaking: true, paused: false, sequenceId: myId });
  startFresh(() => {
    if (myId !== state.sequenceId) return;
    const u = makeUtterance(text, opts?.rate ?? DEFAULT_RATE);
    const finish = () => {
      if (myId === state.sequenceId) {
        setState({ speaking: false, paused: false });
      }
    };
    u.onend = finish;
    u.onerror = finish;
    window.speechSynthesis.speak(u);
  });
  return myId;
}

export function ttsSpeakSequence(
  texts: string[],
  opts?: { rate?: number; onProgress?: (index: number) => void }
): number | null {
  if (!ttsSupported() || texts.length === 0) return null;
  ensureVoiceInit();
  const myId = state.sequenceId + 1;
  seqState = {
    id: myId,
    texts,
    index: 0,
    rate: opts?.rate ?? DEFAULT_RATE,
    onProgress: opts?.onProgress,
  };
  setState({ speaking: true, paused: false, sequenceId: myId });
  startFresh(() => {
    if (myId !== state.sequenceId) return;
    speakSeqFrom(0);
  });
  return myId;
}

// Speak one sentence of the active sequence, then chain to the next on end.
function speakSeqFrom(index: number) {
  const s = seqState;
  if (!ttsSupported() || !s || s.id !== state.sequenceId) return;
  if (index >= s.texts.length) {
    setState({ speaking: false, paused: false });
    seqState = null;
    return;
  }
  s.index = index;
  const myUtter = ++utterToken;
  const u = makeUtterance(s.texts[index], s.rate);
  u.onstart = () => {
    if (s.id === state.sequenceId) s.onProgress?.(index);
  };
  const next = () => {
    // Ignore stale callbacks (a superseded sequence, or an utterance we
    // deliberately cancelled to restart) and never advance while paused.
    if (myUtter !== utterToken || s.id !== state.sequenceId || state.paused) {
      return;
    }
    speakSeqFrom(index + 1);
  };
  u.onend = next;
  u.onerror = next;
  window.speechSynthesis.speak(u);
}

export function ttsStop() {
  // Bump sequenceId + utterToken so any in-flight callbacks become no-ops,
  // and drop the active sequence.
  seqState = null;
  utterToken++;
  setState({
    speaking: false,
    paused: false,
    sequenceId: state.sequenceId + 1,
  });
  if (!ttsSupported()) return;
  const synth = window.speechSynthesis;
  if (synth.paused) {
    try {
      synth.resume();
    } catch {
      /* noop */
    }
  }
  synth.cancel();
}

export function ttsPause() {
  if (!ttsSupported() || !state.speaking || state.paused) return;
  try {
    window.speechSynthesis.pause();
  } catch {
    return;
  }
  setState({ paused: true });
}

export function ttsResume() {
  if (!ttsSupported() || !state.paused) return;
  const synth = window.speechSynthesis;
  try {
    synth.resume();
  } catch {
    /* noop — fall through to the restart fallback below */
  }
  setState({ paused: false });

  // Some browsers (notably Chromium / HarmonyOS) don't actually continue a
  // paused queue on resume(). If the engine still isn't speaking shortly
  // after, restart from the CURRENT sentence rather than leaving the learner
  // stuck or jumping back to the beginning.
  const idAtResume = state.sequenceId;
  setTimeout(() => {
    if (state.sequenceId !== idAtResume || state.paused) return;
    if (!seqState || seqState.id !== idAtResume) return;
    const stuck = synth.paused || (!synth.speaking && !synth.pending);
    if (!stuck) return;
    // Invalidate the wedged utterance, then re-speak the current sentence.
    utterToken++;
    // Same defensive guard as startFresh: some browsers leave the engine
    // wedged if cancel() happens while paused, so resume() first.
    if (synth.paused) {
      try {
        synth.resume();
      } catch {
        /* noop */
      }
    }
    synth.cancel();
    const startIndex = seqState.index;
    setTimeout(() => {
      if (state.sequenceId === idAtResume && !state.paused) {
        speakSeqFrom(startIndex);
      }
    }, CANCEL_SETTLE_MS);
  }, 300);
}

function ttsSubscribe(listener: (s: TTSState) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTTSState() {
  const [supported, setSupported] = useState(false);
  const [s, setS] = useState<TTSState>(state);
  useEffect(() => {
    setSupported(ttsSupported());
    // Pull the latest snapshot in case module-level state changed before mount.
    setS(state);
    return ttsSubscribe(setS);
  }, []);
  return {
    supported,
    speaking: s.speaking,
    paused: s.paused,
    sequenceId: s.sequenceId,
  };
}
