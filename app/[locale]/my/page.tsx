import { notFound } from "next/navigation";
import MyArticlesClient from "@/components/MyArticlesClient";
import { isLocale, type Locale } from "@/lib/i18n";

export default function MyArticlesPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  return <MyArticlesClient locale={params.locale as Locale} />;
}
