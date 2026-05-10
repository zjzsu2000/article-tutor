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

  const linkClass = (href: string) =>
    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      pathname === href
        ? "bg-brand-100 text-brand-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href={home} className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <span className="text-base font-semibold text-slate-900">
            English Study
          </span>
        </Link>
        <nav className="flex items-center gap-1">
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
          <LanguageSwitcher current={locale} />
        </nav>
      </div>
    </header>
  );
}
