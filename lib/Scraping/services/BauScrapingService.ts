// services/BauScrapingService.ts
import { BauApiClient } from "../clients/BauApiClient";
import {
  DegreeApiResponse,
  CollegeApiResponse,
  DepartmentApiResponse,
  CourseApiResponse,
  SectionApiResponse,
} from "../scrape_types";

export class BauScrapingService {
  constructor(private apiClient: BauApiClient) {}

  async fetchDegrees(): Promise<DegreeApiResponse[]> {
    return this.apiClient.request<DegreeApiResponse[]>("getDegrees");
  }

  async fetchColleges(): Promise<CollegeApiResponse[]> {
    return this.apiClient.request<CollegeApiResponse[]>("getColleges");
  }

  async fetchDepartments(collegeId: number): Promise<DepartmentApiResponse[]> {
    return this.apiClient.request<DepartmentApiResponse[]>("getDepartments", [collegeId]);
  }

  async fetchCoursesPage(
    degreeId: number,
    collegeId: number,
    departmentId: number,
    page: number
  ): Promise<CourseApiResponse[]> {
    return this.apiClient.request<CourseApiResponse[]>("getCourses", [
      degreeId,
      collegeId,
      departmentId,
      page,
    ]);
  }

  async fetchSectionsPage(
    degreeId: number,
    collegeId: number,
    departmentId: number,
    page: number
  ): Promise<SectionApiResponse[]> {
    // Same method name "getCourses" but returns sections data
    return this.apiClient.request<SectionApiResponse[]>("getCourses", [
      degreeId,
      collegeId,
      departmentId,
      page,
    ]);
  }

  async getPagesCount(
    degreeId: number,
    collegeId: number,
    departmentId: number
  ): Promise<number> {
    return this.apiClient.getPagesCount(degreeId, collegeId, departmentId);
  }
}