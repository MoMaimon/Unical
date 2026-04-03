import { Model } from "mongoose";

interface BaseSchema {
  _id: number;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DegreeSchema extends BaseSchema {
  name: string;
}


export interface CollegeSchema extends BaseSchema {
  name: string;
}


export interface DepartmentSchema extends BaseSchema{
  name: string;
  college: number;
};

export interface CourseSchema extends BaseSchema {
  name: string;
  degree: number;
  college: number;
  department: number;
  hours: number;
}



export interface FetchParams {
  method: string;
  model: Model<any>;
  paramCount?: number;
  paramList?: Array<number>;
}

export interface DegreeApiResponse {
  id: string;
  name: string;
}

export interface CollegeApiResponse {
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
