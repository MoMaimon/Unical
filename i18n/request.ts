import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, locales } from "./config";

export default getRequestConfig(async () => {
  const store = await cookies();
  const savedLocale = store.get("locale")?.value;
  const locale: string = locales.includes(savedLocale as any)
    ? savedLocale!
    : defaultLocale;

  const common = (await import(`./messages/${locale}/common.json`)).default;
  const home = (await import(`./messages/${locale}/home.json`)).default;
  const courses = (await import(`./messages/${locale}/courses.json`)).default;
  const layout = (await import(`./messages/${locale}/layout.json`)).default;

  return {
    locale,
    messages: {
      ...common,
      Home: home,
      Courses: courses,
      Layout: layout,
    },
  };
});
