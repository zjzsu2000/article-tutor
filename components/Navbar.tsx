"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { loadSavedWords } from "@/lib/storage";
import { getDict, type Locale } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const t = getDict(locale);

  useEffect(() => {
    const update = () => setCount(loadSavedWords().length);
    update();
    window.addEventListener("savedWords:changed", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("savedWords:changed", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const home = `/${locale}`;
  const vocab = `/${locale}/vocabulary`;
  const dictation = `/${locale}/dictation`;

  const linkClass = (href: string) =>
    `rounded-md px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
      pathname === href
        ? "bg-brand-100 text-brand-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-y-2 px-4 py-3 sm:flex-nowrap sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between sm:w-auto">
          <Link href={home} className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span className="text-base font-semibold text-slate-900">
              English Study
            </span>
          </Link>
          <div className="sm:hidden">
            <LanguageSwitcher current={locale} />
          </div>
        </div>
        <nav className="flex w-full items-center justify-between gap-1 sm:ml-auto sm:w-auto sm:justify-start">
          <Link href={home} className={linkClass(home)}>
            {t.nav.topics}
          </Link>
          <Link
            href={vocab}
            className={`${linkClass(vocab)} flex items-center gap-1.5`}
          >
            <span>{t.nav.vocabulary}</span>
            <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-slate-200 px-1.5 text-[11px] font-semibold text-slate-700">
              {count}
            </span>
          </Link>
          <Link href={dictation} className={linkClass(dictation)}>
            {t.nav.dictation}
          </Link>
          <div className="hidden sm:block">
            <LanguageSwitcher current={locale} />
          </div>
        </nav>
      </div>
    </header>
  );
}
