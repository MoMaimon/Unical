import { CollegeSchema, CourseSchema, DegreeSchema, DepartmentSchema, SectionSchema } from "@/types/db_types";
import { IFetchProvider } from "../../IFetchProvider";

export class BAUFetchProvider implements IFetchProvider {
    fetchDegrees(): Promise<DegreeSchema[]> {
        throw new Error("Method not implemented.");
    }
    fetchColleges(): Promise<CollegeSchema[]> {
        throw new Error("Method not implemented.");
    }
    fetchDepartments(collegeId: string): Promise<DepartmentSchema[]> {
        throw new Error("Method not implemented.");
    }
    fetchCourses(degreeId: string, collegeId: string, departmentId: string): Promise<CourseSchema[]> {
        throw new Error("Method not implemented.");
    }
    fetchSections(degreeId: string, collegeId: string, departmentId: string, courseId: string): Promise<SectionSchema[]> {
        throw new Error("Method not implemented.");
    }
}