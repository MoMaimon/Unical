import { College, Course, Department, Degree, Section } from "@/types/Data";

export interface IFetchProvider {
    fetchDegrees(): Promise<Degree[]>;
    fetchColleges(): Promise<College[]>;
    fetchDepartments(collegeId: string): Promise<Department[]>;
    fetchCourses(degreeId: string, collegeId: string, departmentId: string): Promise<Course[]>;
    fetchSections(degreeId: string, collegeId: string, departmentId: string, courseId: string): Promise<Section[]>;
}