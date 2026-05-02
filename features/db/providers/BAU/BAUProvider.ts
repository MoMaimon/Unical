import { IUniversityProvider } from "../../IUniversityProvider";
import { CourseQuery } from "../../types/CourseQuery";
import { PaginatedResult } from "../../types/PaginatedResult";
import { BAUFetchProvider } from "./BAUFetchProvider";
import { Degree, College, Department, Course, Section } from "@/types/Data";

export class BAUProvider implements IUniversityProvider {
    constructor(private fetchProvider: BAUFetchProvider) { }

    // read methods
    async getDegrees(): Promise<Degree[]> {
        throw new Error("Method not implemented.");
    }
    async getColleges(): Promise<College[]> {
        throw new Error("Method not implemented.");
    }
    async getDepartments(collegeId?: string | undefined): Promise<Department[]> {
        throw new Error("Method not implemented.");
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