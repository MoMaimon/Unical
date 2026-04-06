import { Model } from "mongoose";

/* -------------------------------------------------------------------------- */
/*                         Scraper Orchestration Types                        */
/* -------------------------------------------------------------------------- */

export interface FetchParams {
  rmiMethod: string;
  model: Model<any>;
  paramList?: Array<number>;
}

/* -------------------------------------------------------------------------- */
/*                             API Response Types                             */
/* -------------------------------------------------------------------------- */

export interface DegreeApiResponse {
  id: string;
  name: string;
}

export interface CollegeApiResponse {
  id: string;
  name: string;
}

export interface DepartmentApiResponse {
  id: string;
  name: string;
}

export interface CourseApiResponse {
  no: string;
  name: string;
  hours: string;
}

export interface SectionApiResponse {
  name: string;
  no: string;
  status: string;
  rooms: string;
  times: string;
  lecturers: string;
  sectionNo: string;
}
