"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { setLocale } from "@/lib/locale";

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = currentLocale === "en" ? "ar" : "en";
    startTransition(() => {
      setLocale(nextLocale);
    });
  };

  return (
    <Button variant="outline" onClick={toggleLanguage} disabled={isPending}>
      {currentLocale === "en" ? "العربية" : "English"}
    </Button>
  );
}
