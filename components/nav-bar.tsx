import Link from "next/link";
import { SearchBar } from "./ui/SearchBar";
import { Button } from "./ui/button";
import { useLocale, useTranslations } from "use-intl";
import { LanguageSwitcher } from "./language-switcher";
import { getLocale, getTranslations } from "next-intl/server";
import { NavbarSearch } from "./navbar-search";

export default async function NavBar() {
  const locale = await getLocale();
  const t = await getTranslations("NavBar");

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-3xl font-bold">
          <Link href="/">
            <span className="text-primary">Uni</span>cal
          </Link>
        </div>

        <NavbarSearch locale={locale} />

        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLocale={locale}></LanguageSwitcher>
          <Button variant={"ghost"} asChild>
            <Link href="/courses" className="text-xl">
              {t("courses")}
            </Link>
          </Button>
          <Button variant={"ghost"} asChild>
            <Link href="/colleges" className="text-xl">
              {t("colleges")}
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
