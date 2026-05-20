import TokenStrategy from "@/features/complex_filtering/TokenStrategy";
import { IUniversityProvider } from "../../IUniversityProvider";
import { prisma } from "../../utils/prisma";
import { BAUFetchProvider } from "./BAUFetchProvider";
import {
  Degree,
  College,
  Department,
  Section,
  SearchCourse,
} from "@/types/Data";
import PrismaConvertor from "@/features/complex_filtering/PrismaConvertor";
import {
  CourseMapper,
  SectionMapper,
} from "@/features/complex_filtering/lib/Mapper";
import {
  Query,
  PaginatedResult,
  PopulatedCourse,
  PopulatedCourseWithSections,
} from "../../types/ProviderTypes";
import { cacheTag } from "next/cache";

async function getCachedDegrees(): Promise<Degree[]> {
  "use cache";
  cacheTag("degree", "data");
  return await prisma.degrees.findMany();
}

async function getCachedColleges(): Promise<College[]> {
  "use cache";
  cacheTag("college", "data");
  return await prisma.colleges.findMany();
}

async function getCachedDepartments(
  collegeId?: string | undefined,
): Promise<Department[]> {
  "use cache";
  cacheTag("departments", "data");
  return await prisma.departments.findMany({
    where: {
      collegeId: collegeId,
    },
  });
}

export class BAUProvider implements IUniversityProvider {
  constructor(private fetchProvider: BAUFetchProvider) {}

  // read methods
  async getDegrees(): Promise<Degree[]> {
    return await getCachedDegrees();
  }
  async getColleges(): Promise<College[]> {
    return await getCachedColleges();
  }
  async getDepartments(collegeId?: string | undefined): Promise<Department[]> {
    return getCachedDepartments(collegeId);
  }
  async getCourses(query?: Query): Promise<PaginatedResult<PopulatedCourse>> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    let whereParams = {};

    if (query?.filter) {
      const strategy = new TokenStrategy();
      const convertor = new PrismaConvertor();

      const filterObj = strategy.parse(convertor, query.filter, CourseMapper);
      whereParams = filterObj.whereParams;
    }

    const orderBy = query?.sort?.map((s) => ({ [s.field]: s.direction })) || [];

    const [data, totalCount] = await prisma.$transaction([
      prisma.courses.findMany({
        where: whereParams,
        skip: skip,
        take: limit,
        orderBy: orderBy,
        include: {
          degree: true,
          department: {
            include: {
              college: true,
            },
          },
        },
      }),
      prisma.courses.count({
        where: whereParams,
      }),
    ]);

    return {
      data: data as any,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }
  async getCourseById(
    courseId: string,
  ): Promise<PopulatedCourseWithSections | null> {
    const course = await prisma.courses.findUnique({
      where: {
        id: courseId,
      },
      include: {
        degree: true,
        department: {
          include: {
            college: true,
          },
        },
        sections: {
          include: {
            lecturer: true,
            times: true,
          },
        },
      },
    });
    return course;
  }
  async getSections(query?: Query): Promise<PaginatedResult<Section>> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    let whereParams = {};

    if (query?.filter) {
      const strategy = new TokenStrategy();
      const convertor = new PrismaConvertor();

      const filterObj = strategy.parse(convertor, query.filter, SectionMapper);
      whereParams = filterObj.whereParams;
    }

    const orderBy = query?.sort?.map((s) => ({ [s.field]: s.direction })) || [];

    const [data, totalCount] = await prisma.$transaction([
      prisma.sections.findMany({
        where: whereParams,
        skip: skip,
        take: limit,
        orderBy: orderBy,
        include: {
          course: true,
          lecturer: true,
          times: true,
        },
      }),
      prisma.sections.count({
        where: whereParams,
      }),
    ]);

    return {
      data: data as any,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }
  async searchCourses(searchTerm: string): Promise<SearchCourse[]> {
    // 1. Notice the [] here
    const courses = await prisma.$queryRaw`
      SELECT 
        id, 
        "courseCode", 
        "englishName", 
        "arabicName", 
        "creditHours",
        GREATEST(
          similarity("englishName", ${searchTerm}), 
          similarity("arabicName", ${searchTerm})
        ) as sml
      FROM "Courses"
      WHERE 
        -- 2. Hardcode the 0.1 threshold to avoid Postgres type-casting errors
        similarity("englishName", ${searchTerm}) > 0.1
        OR similarity("arabicName", ${searchTerm}) > 0.1
        
        OR "englishName" ILIKE ${"%" + searchTerm + "%"}
        OR "arabicName" ILIKE ${"%" + searchTerm + "%"}
        OR "courseCode" ILIKE ${"%" + searchTerm + "%"}
        
      ORDER BY 
        sml DESC,
        "englishName" ASC
      -- 3. Hardcode the limit 
      LIMIT 10;
    `;

    // 4. Cast it as an array
    return courses as SearchCourse[];
  }

  // sync methods
  syncAll(): void {
    this.syncDegrees();
    this.syncColleges();
    this.syncDepartments();
    this.syncCourses();
    this.syncSections();
  }
  syncDegrees(): void {
    throw new Error("Function not implemented yet");
  }
  syncColleges(): void {
    throw new Error("Function not implemented yet");
  }
  syncDepartments(): void {
    throw new Error("Function not implemented yet");
  }
  syncCourses(): void {
    throw new Error("Function not implemented yet");
  }
  syncSections(): void {
    throw new Error("Function not implemented yet");
  }
}
