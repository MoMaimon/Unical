import { College, Course, Department, Degree, Section } from "@/types/Data";
import { IFetchProvider } from "../../IFetchProvider";

export class BAUFetchProvider implements IFetchProvider {
    fetchDegrees(): Promise<Degree[]> {
        throw new Error("Method not implemented.");
    }
    fetchColleges(): Promise<College[]> {
        throw new Error("Method not implemented.");
    }
    fetchDepartments(collegeId: string): Promise<Department[]> {
        throw new Error("Method not implemented.");
    }
    fetchCourses(degreeId: string, collegeId: string, departmentId: string): Promise<Course[]> {
        throw new Error("Method not implemented.");
    }
    fetchSections(degreeId: string, collegeId: string, departmentId: string, courseId: string): Promise<Section[]> {
        throw new Error("Method not implemented.");
    }
}