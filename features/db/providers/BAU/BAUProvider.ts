import TokenStrategy from "@/features/complex_filtering/TokenStrategy";
import { IUniversityProvider } from "../../IUniversityProvider";
import { CourseQuery } from "../../types/CourseQuery";
import { PaginatedResult } from "../../types/PaginatedResult";
import { prisma } from "../../utils/prisma";
import { BAUFetchProvider } from "./BAUFetchProvider";
import { Degree, College, Department, Course, Section } from "@/types/Data";
import PrismaConvertor from "@/features/complex_filtering/PrismaConvertor";
import { CourseMapper } from "@/features/complex_filtering/lib/Mapper";

export class BAUProvider implements IUniversityProvider {
  constructor(private fetchProvider: BAUFetchProvider) {}

  // read methods
  async getDegrees(): Promise<Degree[]> {
    return await prisma.degrees.findMany();
  }
  async getColleges(): Promise<College[]> {
    return await prisma.colleges.findMany();
  }
  async getDepartments(collegeId?: string | undefined): Promise<Department[]> {
    return await prisma.departments.findMany({
      where: {
        collegeId: collegeId,
      },
    });
  }
  async getCourses(query?: CourseQuery): Promise<PaginatedResult<Course>> {
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
          department: true,
          degree: true,
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
  async getSections(courseId: string): Promise<Section[]> {
    throw new Error("Method not implemented.");
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
    this.fetchProvider.fetchDegrees();
  }
  syncColleges(): void {
    this.fetchProvider.fetchColleges();
  }
  syncDepartments(): void {
    // TODO: Implement
  }
  syncCourses(): void {
    // TODO: Implement
  }
  syncSections(): void {
    // TODO: Implement
  }
}
