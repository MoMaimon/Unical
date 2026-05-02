import { CourseQuery } from "./types/CourseQuery";
import { PaginatedResult } from "./types/PaginatedResult";
import { College, Degree, Department, Course, Section } from "@/types/Data";

export interface IUniversityProvider {

    getDegrees(): Promise<Degree[]>;
    getColleges(): Promise<College[]>;
    getDepartments(collegeId?: string): Promise<Department[]>;
    getCourses(query?: CourseQuery): Promise<PaginatedResult<Course>>;
    getSections(courseId: string): Promise<Section[]>;

    //sync methods
    syncAll(): void;
    syncDegrees(): void;
    syncColleges(): void;
    syncDepartments(): void;
    syncCourses(): void;
    syncSections(): void;
}
