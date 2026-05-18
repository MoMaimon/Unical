import { ProviderFactory } from "@/features/db/providers/ProviderFactory";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, MapPin, User, Wifi, Plus } from "lucide-react";
import { getLocale } from "next-intl/server";

function getDaysFromMask(mask: number): number[] {
  const activeDays: number[] = [];
  for (let i = 0; i < 7; i++) {
    if ((mask & (1 << i)) !== 0) {
      activeDays.push(i);
    }
  }
  return activeDays;
}
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = ProviderFactory.getProvider("BAU");
  const course = await provider.getCourseById(id);
  const locale = await getLocale()
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
            Sections
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => {
              const isOpen = section.status === 1;
              return (
                <Card key={section.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">
                        Section {section.sectionNo}
                      </CardTitle>
                      <Badge variant={isOpen ? "default" : "secondary"}>
                        {isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    {section.lecturer && (
                      <CardDescription className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {section.lecturer.name}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1 space-y-2 pb-3">
                    {section.times && section.times.length > 0 ? (
                      section.times.map((time) => (
                        <div
                          key={time.id}
                          className="rounded-md bg-muted/50 p-2 text-sm space-y-1"
                        >
                          <div className="flex items-center gap-1.5 font-medium">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>
                              {getDaysFromMask(time.days)
                                .map((d: number) => DAYS[d] ?? d)
                                .join(", ")}
                            </span>
                            <span className="text-muted-foreground">
                              {time.startTime.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}{" "}
                              –{" "}
                              {time.endTime.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            {time.isOnline ? (
                              <span className="flex items-center gap-1">
                                <Wifi className="h-3.5 w-3.5" /> Online
                              </span>
                            ) : (
                              time.room && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {time.room}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No schedule info available.
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button className="w-full gap-2" disabled={!isOpen}>
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
