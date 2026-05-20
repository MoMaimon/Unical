import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, locales } from "./config";

export default getRequestConfig(async () => {
  const store = await cookies();
  const savedLocale = store.get("locale")?.value;
  const locale: string = locales.includes(savedLocale as any)
    ? savedLocale!
    : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});