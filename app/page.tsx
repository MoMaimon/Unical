import { SearchBar } from "@/components/ui/SearchBar";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-col flex-1 justify-center items-center w-full px-4 text-center">
      <div className="flex flex-col gap-4 max-w-3xl z-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          {t("heroTitle")}
        </h1>
        <h2 className="text-lg md:text-xl text-muted-foreground">
          {t("heroDescription")}
        </h2>
      </div>

      <div className="w-full max-w-2xl 2xl:max-w-3xl mt-8 z-10">
        <SearchBar className="max-w-2xl 2xl:max-w-3xl" />
      </div>
    </div>
  );
}
