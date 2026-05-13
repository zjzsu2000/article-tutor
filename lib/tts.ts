"use client";

import { useEffect, useState } from "react";

type Listener = (speaking: boolean) => void;
const listeners = new Set<Listener>();
let currentVoice: SpeechSynthesisVoice | null = null;
let voiceInitialized = false;
let sequenceId = 0;

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

function notify(speaking: boolean) {
  listeners.forEach((l) => l(speaking));
}

function queueUtterance(
  text: string,
  rate: number,
  myId: number,
  isLast: boolean,
  onProgress?: () => void
) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  if (currentVoice) u.voice = currentVoice;
  u.rate = rate;
  if (onProgress) {
    u.onstart = () => {
      if (myId === sequenceId) onProgress();
    };
  }
  if (isLast) {
    const finish = () => {
      if (myId === sequenceId) notify(false);
    };
    u.onend = finish;
    u.onerror = finish;
  }
  window.speechSynthesis.speak(u);
}

export function ttsSpeak(text: string, opts?: { rate?: number }) {
  if (!ttsSupported()) return;
  ensureVoiceInit();
  window.speechSynthesis.cancel();
  const myId = ++sequenceId;
  notify(true);
  queueUtterance(text, opts?.rate ?? 0.9, myId, true);
}

export function ttsSpeakSequence(
  texts: string[],
  opts?: { rate?: number; onProgress?: (index: number) => void }
) {
  if (!ttsSupported() || texts.length === 0) return;
  ensureVoiceInit();
  window.speechSynthesis.cancel();
  const myId = ++sequenceId;
  notify(true);
  texts.forEach((t, i) => {
    const isLast = i === texts.length - 1;
    queueUtterance(
      t,
      opts?.rate ?? 0.9,
      myId,
      isLast,
      opts?.onProgress ? () => opts.onProgress!(i) : undefined
    );
  });
}

export function ttsStop() {
  if (!ttsSupported()) return;
  sequenceId++;
  window.speechSynthesis.cancel();
  notify(false);
}

function ttsSubscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTTSState() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => {
    setSupported(ttsSupported());
    return ttsSubscribe(setSpeaking);
  }, []);
  return { supported, speaking };
}
