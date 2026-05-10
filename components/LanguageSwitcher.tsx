"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDict, locales, type Locale } from "@/lib/i18n";

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || "/";
  const t = getDict(current);

  const buildHref = (target: Locale) => {
    const segments = pathname.split("/");
    if (segments.length > 1 && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = target;
      return segments.join("/") || `/${target}`;
    }
    return `/${target}`;
  };

  return (
    <div
      role="group"
      aria-label={t.switcher.label}
      className="ml-1 flex items-center rounded-lg border border-slate-200 bg-white p-0.5"
    >
      {locales.map((l) => (
        <Link
          key={l}
          href={buildHref(l)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            l === current
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {l === "zh" ? t.switcher.zh : t.switcher.en}
        </Link>
      ))}
    </div>
  );
}
