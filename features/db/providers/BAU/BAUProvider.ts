import { IUniversityProvider } from "../../IUniversityProvider";
import { CollegeSchema, CourseSchema, DepartmentSchema, DegreeSchema, SectionSchema } from "@/types/db_types";
import { CourseQuery } from "../../types/CourseQuery";
import { PaginatedResult } from "../../types/PaginatedResult";
import { BAUFetchProvider } from "./BAUFetchProvider";

export class BAUProvider implements IUniversityProvider {
    constructor(private fetchProvider: BAUFetchProvider) { }

    // read methods
    async getDegrees(): Promise<DegreeSchema[]> {
        throw new Error("Method not implemented.");
    }
    async getColleges(): Promise<CollegeSchema[]> {
        throw new Error("Method not implemented.");
    }
    async getDepartments(collegeId?: string | undefined): Promise<DepartmentSchema[]> {
        throw new Error("Method not implemented.");
    }
    async getCourses(query?: CourseQuery | undefined): Promise<PaginatedResult<CourseSchema>> {
        throw new Error("Method not implemented.");
    }
    async getSections(courseId: string): Promise<SectionSchema[]> {
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