import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 space-y-8">
      {/* Course Header Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          {/* Book icon and course code skeleton */}
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-2" />
        </div>
        
        {/* Course Title skeleton */}
        <Skeleton className="h-9 w-3/4 max-w-150" />
        
        {/* Badges skeleton */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-36 rounded-full" />
        </div>
      </div>

      <Separator />

      {/* Sections Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {/* Sections Title skeleton */}
          <Skeleton className="h-8 w-40" />
        </div>

        {/* Section List Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  {/* Section Title */}
                  <Skeleton className="h-6 w-24" />
                  {/* Status Badge */}
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                {/* Lecturer Name */}
                <Skeleton className="h-4 w-32 mt-1" />
              </CardHeader>

              <CardContent className="flex-1 space-y-2 pb-3">
                {/* Schedule Info Box */}
                <div className="rounded-md bg-muted/50 p-2 space-y-2">
                  <div className="flex items-center gap-1.5">
                    {/* Clock Icon & Time */}
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Location Icon & Room */}
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                {/* Add Button */}
                <Skeleton className="h-10 w-full rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}