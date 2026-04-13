"use client";
import Link from "next/link";
import { SearchBar } from "./ui/SearchBar";
import { Button } from "./ui/button";
import { useLocale, useTranslations } from "use-intl";
import { LanguageSwitcher } from "./language-switcher";

export default function NavBar() {
  const locale = useLocale();
  const t = useTranslations("NavBar");
  return (
    <nav className="flex justify-between items-center p-6">
      <div className="text-3xl font-bold">
        <Link href="/">
          <span className="text-primary">Uni</span>cal
        </Link>
      </div>

      <SearchBar className="md:max-w-xs lg:max-w-lg 2xl:max-w-2xl" />

      <div>
        <LanguageSwitcher currentLocale={locale}></LanguageSwitcher>
        <Button variant={"ghost"} asChild>
          <Link href="/departments" className="text-xl">
            {t("departments")}
          </Link>
        </Button>
        <Button variant={"ghost"} asChild>
          <Link href="/colleges" className="text-xl">
            {t("colleges")}
          </Link>
        </Button>
      </div>
    </nav>
  );
}
