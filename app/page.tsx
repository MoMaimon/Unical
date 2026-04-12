import { SearchBar } from "@/components/ui/SearchBar";

export default function Home() {
  return (
    <div className="flex flex-col justify-start pt-[20vh] items-center flex-1 gap-10">
      <div className="text-6xl font-bold flex flex-col gap-2.5 tracking-wider">
        <h1>Find your courses.</h1>
        <h2 className="text-primary">Build your schedule.</h2>
      </div>

      <SearchBar className="max-w-2xl 2xl:max-w-3xl" />
    </div>
  );
}
