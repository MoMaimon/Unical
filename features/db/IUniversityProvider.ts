import {
  College,
  Degree,
  Department,
  SearchCourse,
  Section,
} from "@/types/Data";
import { PaginatedResult, PopulatedCourse, Query } from "./types/ProviderTypes";

export interface IUniversityProvider {
  getDegrees(): Promise<Degree[]>;
  getColleges(): Promise<College[]>;
  getDepartments(collegeId?: string): Promise<Department[]>;
  getCourses(query?: Query): Promise<PaginatedResult<PopulatedCourse>>;
  getSections(query?: Query): Promise<PaginatedResult<Section>>;
  searchCourses(searchTerm: string): Promise<SearchCourse[]>;

  //sync methods
  syncAll(): void;
  syncDegrees(): void;
  syncColleges(): void;
  syncDepartments(): void;
  syncCourses(): void;
  syncSections(): void;
}
