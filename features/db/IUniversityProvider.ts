import { CollegeSchema, CourseSchema, DepartmentSchema, DegreeSchema, SectionSchema } from "@/types/db_types";
import { CourseQuery } from "./types/CourseQuery";
import { PaginatedResult } from "./types/PaginatedResult";
import { IFetchProvider } from "./IFetchProvider";

export interface IUniversityProvider {

    getDegrees(): Promise<DegreeSchema[]>;
    getColleges(): Promise<CollegeSchema[]>;
    getDepartments(collegeId?: string): Promise<DepartmentSchema[]>;
    getCourses(query?: CourseQuery): Promise<PaginatedResult<CourseSchema>>;
    getSections(courseId: string): Promise<SectionSchema[]>;

    //sync methods
    syncAll(): void;
    syncDegrees(): void;
    syncColleges(): void;
    syncDepartments(): void;
    syncCourses(): void;
    syncSections(): void;
}
