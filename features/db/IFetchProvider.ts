import { CollegeApiResponse, CourseApiResponse, DepartmentApiResponse, DegreeApiResponse, SectionApiResponse } from "./types/APIResponse";

export interface IFetchProvider {
    fetchDegrees(): Promise<DegreeApiResponse[]>;
    fetchColleges(): Promise<CollegeApiResponse[]>;
    fetchDepartments(collegeId: string): Promise<DepartmentApiResponse[]>;
    fetchCourses(degreeId: string, collegeId: string, departmentId: string): Promise<CourseApiResponse[]>;
    fetchSections(degreeId: string, collegeId: string, departmentId: string): Promise<SectionApiResponse[]>;
}