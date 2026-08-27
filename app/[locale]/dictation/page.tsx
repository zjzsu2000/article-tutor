import { notFound } from "next/navigation";
import DictationClient from "@/components/DictationClient";
import { isLocale, type Locale } from "@/lib/i18n";

export default function DictationPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  return <DictationClient locale={params.locale as Locale} />;
}
