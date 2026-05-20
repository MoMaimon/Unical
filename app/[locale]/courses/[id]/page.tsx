import { ProviderFactory } from "@/features/db/providers/ProviderFactory";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen,} from "lucide-react";
import { getLocale } from "next-intl/server";
import SectionList from "./SectionList";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = ProviderFactory.getProvider("BAU");
  const course = await provider.getCourseById(id);
  const locale = await getLocale();

  if (!course) {
    notFound();
  }
  
  const sections = course.sections ?? [];
  const nameField = locale === "ar" ? "arabicName" : "englishName";
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 space-y-8">
      {/* Course Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <BookOpen className="h-4 w-4" />
          <span>{course.courseCode}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {course[nameField]}
        </h1>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary">{course.creditHours} Credit Hours</Badge>
          {course.degree && (
            <Badge variant="outline">{course.degree[nameField]}</Badge>
          )}
          {course.department && (
            <Badge variant="outline">{course.department[nameField]}</Badge>
          )}
          {course.department?.college && (
            <Badge variant="outline">
              {course.department.college[nameField]}
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Sections&nbsp;
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({sections.length})
            </span>
          </h2>
        </div>

        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-muted-foreground gap-2">
            <BookOpen className="h-10 w-10 opacity-30" />
            <p className="text-sm">No sections available for this course.</p>
          </div>
        ) : (
          <SectionList sections={sections} />
        )}
      </div>
    </div>
  );
}
