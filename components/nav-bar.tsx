import Link from "next/link";
import { Button } from "./ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { getLocale, getTranslations } from "next-intl/server";
import { NavbarSearch } from "./navbar-search";

export default async function NavBar() {
  const locale = await getLocale();
  const t = await getTranslations();

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
              {t("Entities.course", { count: 100 })}
            </Link>
          </Button>
          <Button variant={"ghost"} asChild>
            <Link href="/colleges" className="text-xl">
              {t("Entities.college",{ count: 100 })}
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
