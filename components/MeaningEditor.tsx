"use client";

import { useEffect, useState } from "react";
import { getDict, type Locale } from "@/lib/i18n";

/**
 * Small inline editor for the learner's own Chinese meaning.
 *
 * Used in both the reading panel and the vocabulary notebook. It only edits
 * `userTranslation` — the dictionary's own `translation` is never touched, so
 * a learner's wording and the dictionary entry always coexist.
 */
export default function MeaningEditor({
  current,
  locale,
  labels,
  note,
  onSave,
  onCancel,
  autoFocus = true,
}: {
  current?: string;
  locale: Locale;
  // Lets the notebook and the panel use their own wording for the same UI.
  labels?: { save?: string; cancel?: string; clear?: string; placeholder?: string };
  note?: string;
  onSave: (text: string) => void;
  onCancel: () => void;
  autoFocus?: boolean;
}) {
  const t = getDict(locale);
  const [text, setText] = useState(current ?? "");

  // Re-seed when switching to a different item while the editor is open.
  useEffect(() => setText(current ?? ""), [current]);

  const save = (value: string) => {
    onSave(value.trim());
  };

  return (
    <div className="mt-2">
      <textarea
        value={text}
        autoFocus={autoFocus}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          // Enter saves (a meaning is one short line); Shift+Enter is a
          // newline for anyone who wants one. Escape cancels.
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            save(text);
          } else if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
        rows={2}
        placeholder={labels?.placeholder ?? t.panel.meaningPlaceholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
      {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => save(text)}
          className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
        >
          {labels?.save ?? t.panel.saveMeaning}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          {labels?.cancel ?? t.panel.cancelMeaning}
        </button>
        {(current ?? "").trim().length > 0 && (
          <button
            type="button"
            onClick={() => save("")}
            className="ml-auto text-xs font-medium text-rose-600 hover:underline"
          >
            {labels?.clear ?? t.panel.clearMeaning}
          </button>
        )}
      </div>
    </div>
  );
}
