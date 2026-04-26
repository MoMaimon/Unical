/* -------------------------------------------------------------------------- */
/*                              Database Schemas                              */
/* -------------------------------------------------------------------------- */

interface BaseSchema {
  _id: string;
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

export interface DepartmentSchema extends BaseSchema {
  name: string;
  college: string;
}

export interface CourseSchema extends BaseSchema {
  name: string;
  degree: string;
  college: string;
  department: string;
  hours: number;
}

export interface CourseSchemaPopulated extends Omit<
  CourseSchema,
  "degree" | "college" | "department"
> {
  degree: DegreeSchema;
  college: CollegeSchema;
  department: DepartmentSchema;
}

export interface SectionSchema extends Omit<BaseSchema, "_id"> {
  _id: string;
  name: string;
  status: number;
  lecturers: string;
  courseNo: string;
  sectionNo: number;

  schedules: Array<{
    days: number[];
    startTime: string;
    endTime: string;
    startMinutes: number;
    endMinutes: number;
    room: string;
    isOnline: boolean;
  }>;

  isFullyOnline: boolean;
  isPartiallyOnline: boolean;
  onlineDays: number;
}
