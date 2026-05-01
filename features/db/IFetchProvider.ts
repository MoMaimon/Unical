import { CollegeSchema, CourseSchema, DegreeSchema, DepartmentSchema, SectionSchema } from "@/types/db_types";

export interface IFetchProvider {
    fetchDegrees(): Promise<DegreeSchema[]>;
    fetchColleges(): Promise<CollegeSchema[]>;
    fetchDepartments(collegeId: string): Promise<DepartmentSchema[]>;
    fetchCourses(degreeId: string, collegeId: string, departmentId: string): Promise<CourseSchema[]>;
    fetchSections(degreeId: string, collegeId: string, departmentId: string, courseId: string): Promise<SectionSchema[]>;
}