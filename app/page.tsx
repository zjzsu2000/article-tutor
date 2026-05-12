import Link from "next/link";
import { defaultLocale } from "@/lib/i18n";

export default function RootPage() {
  const target = `/${defaultLocale}`;
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8 text-sm text-slate-500">
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(target)});`,
        }}
      />
      <noscript>
        <Link href={target} className="text-brand-600 underline">
          Continue to English Study →
        </Link>
      </noscript>
      <span>Loading…</span>
    </div>
  );
}
