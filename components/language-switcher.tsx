"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { setLocale } from "@/lib/locale";
import { locales, localeNames, Locale } from "@/i18n/config";

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (nextLocale: Locale) => {
    startTransition(() => {
      setLocale(nextLocale);
    });
  };

  return (
    <div className="flex gap-2">
      {locales.map((loc) => (
        <Button
          key={loc}
          variant={currentLocale === loc ? "default" : "outline"}
          onClick={() => handleLanguageChange(loc)}
          disabled={isPending || currentLocale === loc}
        >
          {localeNames[loc]}
        </Button>
      ))}
    </div>
  );
}