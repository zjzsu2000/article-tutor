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
  setState({ speaking: true, paused: false, sequenceId: myId });
  startFresh(() => {
    if (myId !== state.sequenceId) return;
    texts.forEach((text, i) => {
      const u = makeUtterance(text, opts?.rate ?? DEFAULT_RATE);
      if (opts?.onProgress) {
        u.onstart = () => {
          if (myId === state.sequenceId) opts.onProgress!(i);
        };
      }
      if (i === texts.length - 1) {
        const finish = () => {
          if (myId === state.sequenceId) {
            setState({ speaking: false, paused: false });
          }
        };
        u.onend = finish;
        u.onerror = finish;
      }
      window.speechSynthesis.speak(u);
    });
  });
  return myId;
}

export function ttsStop() {
  // Bump sequenceId so any in-flight callbacks become no-ops.
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
  try {
    window.speechSynthesis.resume();
  } catch {
    return;
  }
  setState({ paused: false });
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
