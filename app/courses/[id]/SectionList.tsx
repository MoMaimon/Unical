import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PopulatedSection } from "@/features/db/types/ProviderTypes";

import { User, Clock, Wifi, MapPin, Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

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

export default async function SectionList({
  sections,
}: {
  sections: PopulatedSection[];
}) {
  const t = await getTranslations();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => {
        const isOpen = section.status === 1;
        return (
          <Card key={section.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">
                  {t("Entities.section", { count: -1 })} {section.sectionNo}
                </CardTitle>
                <Badge variant={isOpen ? "default" : "secondary"}>
                  {isOpen ? t("Status.open") : t("Status.closed")}
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
              <Button
                className="w-full gap-2 cursor-pointer"
                disabled={!isOpen}
              >
                <Plus className="h-4 w-4" />
                {t("Actions.add")}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
