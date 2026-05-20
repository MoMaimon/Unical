import { Prisma } from "@/generated/prisma/client";

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
}

export interface Query {
  page: number;
  limit: number;
  filter?: string;
  sort?: {
    field: string;
    direction: "asc" | "desc";
  }[];
}

export type PopulatedCourse = Prisma.CoursesGetPayload<{
  include: {
    degree: true;
    department: {
      include: {
        college: true;
      };
    };
  };
}>;

export type PopulatedSection = Prisma.SectionsGetPayload<{
  include: {
    lecturer: true;
    times: true;
  };
}>;

export type PopulatedCourseWithSections = Prisma.CoursesGetPayload<{
  include: {
    degree: true;
    department: {
      include: {
        college: true;
      };
    };
    sections: {
      include: {
        lecturer: true;
        times: true;
      };
    };
  };
}>;
