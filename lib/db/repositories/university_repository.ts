import {
  CollegeSchema,
  CourseSchema,
  DegreeSchema,
  DepartmentSchema,
  SectionSchema,
} from "@/lib/db/db_types";
import Degree from "../models/degrees";
import connect from "../db";
import College from "../models/colleges";
import Department from "../models/departments";
import Course from "../models/courses";
import Section from "../models/sections";

/**
 * Retrieves a single degree by its ID.
 * @param {number} id - The ID of the degree.
 * @returns {Promise<DegreeSchema | null>} The degree object, or null if not found.
 */
export const getDegree = async (id: number): Promise<DegreeSchema | null> => {
  await connect();
  const degree = await Degree.findById(id).lean<DegreeSchema>();
  return degree;
};

/**
 * Retrieves a single department by its ID.
 * @param {number} id - The ID of the department.
 * @returns {Promise<DepartmentSchema | null>} The department object, or null if not found.
 */
export const getCollege = async (id: number): Promise<CollegeSchema | null> => {
  await connect();
  const college = await College.findById(id).lean<CollegeSchema>();
  return college;
};

/**
 * Retrieves a single department by its ID.
 * @param {number} id - The ID of the department.
 * @returns {Promise<DepartmentSchema | null>} The department object, or null if not found.
 */
export const getDepartment = async (
  id: number,
): Promise<DepartmentSchema | null> => {
  await connect();
  const department = await Department.findById(id).lean<DepartmentSchema>();
  return department;
};

/**
 * Retrieves a single course by its ID.
 * @param {string} id - The ID of the course.
 * @returns {Promise<CourseSchema | null>} The course object, or null if not found.
 */
export const getCourse = async (id: string): Promise<CourseSchema | null> => {
  await connect();
  const course = await Course.findById(id).lean<CourseSchema>();
  return course;
};

/**
 * Retrieves a single section by its ID.
 * @param {string} id - The ID of the section.
 * @returns {Promise<SectionSchema | null>} The section object, or null if not found.
 */
export const getSection = async (id: string): Promise<SectionSchema | null> => {
  await connect();
  const section = await Section.findById(id).lean<SectionSchema>();
  return section;
};

/**
 * Retrieves all degrees stored in the database.
 * * @returns {Promise<DegreeSchema[]>} An array of all degrees.
 */
export const getDegrees = async (): Promise<DegreeSchema[]> => {
  await connect();
  const degrees = await Degree.find({}).lean<DegreeSchema[]>();
  return degrees;
};

/**
 * Retrieves all colleges stored in the database.
 * * @returns {Promise<CollegeSchema[]>} An array of all colleges.
 */
export const getColleges = async (): Promise<CollegeSchema[]> => {
  await connect();
  const colleges = await College.find({}).lean<CollegeSchema[]>();
  return colleges;
};

/**
 * Retrieves all departments stored in the database.
 * * @returns {Promise<DepartmentSchema[]>} An array of all departments.
 */
export const getDepartments = async (): Promise<DepartmentSchema[]> => {
  await connect();
  const departments = await Department.find({}).lean<DepartmentSchema[]>();
  return departments;
};

/**
 * Retrieves all departments that belong to a specific college.
 * * @param {number} collegeId - The ID of the college.
 * @returns {Promise<DepartmentSchema[]>} An array of matching departments.
 */
export const getDepartmentsByCollege = async (
  collegeId: number,
): Promise<DepartmentSchema[]> => {
  await connect();
  const departments = await Department.find({ college: collegeId }).lean<
    DepartmentSchema[]
  >();
  return departments;
};

/**
 * Retrieves all courses that belong to a specific college.
 * Note: For large datasets, consider using pagination instead.
 * * @param {number} collegeId - The ID of the college.
 * @returns {Promise<CourseSchema[]>} An array of matching courses.
 */
export const getCoursesByCollege = async (
  collegeId: number,
): Promise<CourseSchema[]> => {
  await connect();
  const courses = await Course.find({ college: collegeId }).lean<
    CourseSchema[]
  >();
  return courses;
};

/**
 * Retrieves all courses that belong to a specific department.
 * * @param {number} departmentId - The ID of the department.
 * @returns {Promise<CourseSchema[]>} An array of matching courses.
 */
export const getCoursesByDepartment = async (
  departmentId: number,
): Promise<CourseSchema[]> => {
  await connect();
  const courses = await Course.find({ department: departmentId }).lean<
    CourseSchema[]
  >();
  return courses;
};

export const getCollegeFilter = async (collegeId: number) => {
  await connect();

  const courses = await Course.find({ college: collegeId })
    .select("_id")
    .lean();

  const coursesIds = courses.map((course) => course._id);
  return coursesIds;
};

export const getDepartmentFilter = async (departmentId: number) => {
  await connect();

  const courses = await Course.find({ department: departmentId })
    .select("_id")
    .lean();

  const coursesIds = courses.map((course) => course._id);
  return coursesIds;
};

interface PaginationParams {
  page: number;
  limit?: number;
  filter?: Record<string, any>;
}

/**
 * Retrieves a paginated list of courses from the database.
 * Useful for displaying large directories of courses without overloading the frontend.
 *
 * @param {PaginationParams} params - The pagination and filtering configuration.
 * @returns {Promise<CourseSchema[]>} An array of courses for the requested page.
 */
export const getCoursesPage = async ({
  page,
  limit = 20,
  filter = {},
}: PaginationParams) => {
  await connect();
  const skipIndex = (page - 1) * limit;

  const courses = await Course.find(filter)
    .skip(skipIndex)
    .limit(limit)
    .lean<CourseSchema[]>();

  return courses;
};

export const getSectionsPage = async ({
  page,
  limit = 20,
  filter = {},
}: PaginationParams) => {
  await connect();
  const skipIndex = (page - 1) * limit;

  const sections = await Section.find(filter)
    .skip(skipIndex)
    .limit(limit)
    .lean<SectionSchema[]>();

  return sections;
};
