import { SearchBar } from "@/components/ui/SearchBar";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col justify-start pt-[20vh] items-center flex-1 gap-10">
      <div className="text-6xl font-bold flex flex-col gap-2.5 tracking-wider">
        <h1>{t("heroTitle")}</h1>
        <h2 className="text-primary">{t("heroDescription")}</h2>
      </div>

      <SearchBar className="max-w-2xl 2xl:max-w-3xl" />
    </div>
  );
}
