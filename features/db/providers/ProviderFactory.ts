import { IUniversityProvider } from "../IUniversityProvider";
import { CourseQuery } from "../types/CourseQuery";
import { PaginatedResult } from "../types/PaginatedResult";
import { BAUFetchProvider } from "./BAU/BAUFetchProvider";
import { BAUProvider } from "./BAU/BAUProvider";
import { College, Course, Department, Degree, Section } from "@/types/Data";

export class ProviderFactory implements IUniversityProvider {
    private provider?: IUniversityProvider;

    createBAUProvider() {
        this.provider = new BAUProvider(new BAUFetchProvider);
    }

    // read methods
    getDegrees(): Promise<Degree[]> {
        if (!this.provider) throw new Error("Provider not initialized");
        return this.provider.getDegrees();
    }
    getColleges(): Promise<College[]> {
        if (!this.provider) throw new Error("Provider not initialized");
        return this.provider.getColleges();
    }
    getDepartments(collegeId?: string): Promise<Department[]> {
        if (!this.provider) throw new Error("Provider not initialized");
        return this.provider.getDepartments(collegeId);
    }
    getCourses(query?: CourseQuery): Promise<PaginatedResult<Course>> {
        if (!this.provider) throw new Error("Provider not initialized");
        return this.provider.getCourses(query);
    }
    getSections(courseId: string): Promise<Section[]> {
        if (!this.provider) throw new Error("Provider not initialized");
        return this.provider.getSections(courseId);
    }

    // sync methods
    syncAll(): void {
        if (!this.provider) throw new Error("Provider not initialized");
        this.provider.syncAll();
    }
    syncDegrees(): void {
        if (!this.provider) throw new Error("Provider not initialized");
        this.provider.syncDegrees();
    }
    syncColleges(): void {
        if (!this.provider) throw new Error("Provider not initialized");
        this.provider.syncColleges();
    }
    syncDepartments(): void {
        if (!this.provider) throw new Error("Provider not initialized");
        this.provider.syncDepartments();
    }
    syncCourses(): void {
        if (!this.provider) throw new Error("Provider not initialized");
        this.provider.syncCourses();
    }
    syncSections(): void {
        if (!this.provider) throw new Error("Provider not initialized");
        this.provider.syncSections();
    }
}