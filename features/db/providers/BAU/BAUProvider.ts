import { IUniversityProvider } from "../../IUniversityProvider";
import { CourseQuery } from "../../types/CourseQuery";
import { PaginatedResult } from "../../types/PaginatedResult";
import { prisma } from "../../utils/prisma";
import { BAUFetchProvider } from "./BAUFetchProvider";
import { Degree, College, Department, Course, Section } from "@/types/Data";

export class BAUProvider implements IUniversityProvider {
    constructor(private fetchProvider: BAUFetchProvider) { }

    // read methods
    async getDegrees(): Promise<Degree[]> {
        return await prisma.degrees.findMany()
    }
    async getColleges(): Promise<College[]> {
        return await prisma.colleges.findMany()
    }
    async getDepartments(collegeId?: string | undefined): Promise<Department[]> {
        return await prisma.departments.findMany({where:{
            collegeId: collegeId
        }})
    }
    async getCourses(query?: CourseQuery | undefined): Promise<PaginatedResult<Course>> {
        throw new Error("Method not implemented.");
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