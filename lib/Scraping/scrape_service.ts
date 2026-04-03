import pLimit from "p-limit";
import connect from "@/lib/db/db";
import College from "@/lib/db/models/colleges";
import Degree from "@/lib/db/models/degrees";
import Department from "@/lib/db/models/departments";
import { fetchAndSave, getPagesCount } from "@/lib/Scraping/scrape";
import Course from "@/lib/db/models/courses";
import {
  CollegeApiResponse,
  CollegeSchema,
  CourseApiResponse,
  CourseSchema,
  DegreeApiResponse,
  DegreeSchema,
  DepartmentApiResponse,
  DepartmentSchema,
} from "./scrape_types";

/**
 * Retrieves an array of all College IDs currently stored in the database.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of college IDs.
 */
const getCollegesIds = async (): Promise<Array<number>> => {
  await connect();
  return await College.distinct("_id");
};

/**
 * Retrieves an array of all Degree IDs currently stored in the database.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of degree IDs.
 */
const getDegreesIds = async (): Promise<Array<number>> => {
  await connect();
  return await Degree.distinct("_id");
};

/**
 * Retrieves an array of Department IDs associated with a specific college.
 * @param {number} college_id - The ID of the college to filter departments by.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of department IDs.
 */
const getDepartmentsIds = async (
  college_id: number,
): Promise<Array<number>> => {
  await connect();
  return await Department.distinct("_id", { college: college_id });
};

/* -------------------------------------------------------------------------- */
/*                              Syncing Functions                             */
/* -------------------------------------------------------------------------- */

/**
 * Fetches all degrees from the external API and upserts them into the database.
 * @returns {Promise<void>}
 */
export const syncDegrees = async () => {
  await fetchAndSave<DegreeApiResponse>(
    { method: "getDegrees", model: Degree },
    (degree) => ({
      updateOne: {
        filter: { _id: degree.id },
        update: { $set: { name: degree.name } },
        upsert: true,
      },
    }),
  );
};

/**
 * Fetches all colleges from the external API and upserts them into the database.
 * @returns {Promise<void>}
 */
export const syncColleges = async () => {
  await fetchAndSave<CollegeApiResponse>(
    { method: "getColleges", model: College },
    (college) => ({
      updateOne: {
        filter: { _id: college.id },
        update: { $set: { name: college.name } },
        upsert: true,
      },
    }),
  );
};

/**
 * Iterates through all saved colleges, fetches their respective departments
 * from the external API, and upserts them into the database.
 * @returns {Promise<void>}
 */
export const syncDepartments = async () => {
  const colleges = await getCollegesIds();
  for (const college of colleges) {
    await fetchAndSave<DepartmentApiResponse>(
      {
        method: "getDepartments",
        model: Department,
        paramCount: 1,
        paramList: [college],
      },
      (department) => ({
        updateOne: {
          filter: { _id: department.id },
          update: { $set: { name: department.name, college: college } },
          upsert: true,
        },
      }),
    );
  }
};

/**
 * Fetches and synchronizes all courses for a specific college from the external API.
 * Uses `p-limit` to restrict concurrent requests and implements a 300ms delay
 * between page fetches to prevent rate-limiting or timeout errors.
 * @param {number} college - The ID of the college to sync courses for.
 * @returns {Promise<void>}
 */
export const syncCourses = async (college: number) => {
  const degrees = await getDegreesIds();
  const departments = await getDepartmentsIds(college);

  const limit = pLimit(2);
  const tasks = [];

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  for (const degree of degrees) {
    for (const department of departments) {
      tasks.push(
        limit(async () => {
          const pagesCount = await getPagesCount(degree, college, department);

          if (!pagesCount || pagesCount < 1) return;

          for (let i = 1; i <= pagesCount; i++) {
            await fetchAndSave<CourseApiResponse>(
              {
                method: "getCourses",
                model: Course,
                paramCount: 4,
                paramList: [degree, college, department, i],
              },
              (course) => ({
                updateOne: {
                  filter: { _id: course.no },
                  update: {
                    $set: {
                      name: course.name,
                      college: college,
                      hours: course.hours,
                    },
                  },
                  upsert: true,
                },
              }),
            );
            await delay(300); // 300ms delay between pages
          }
        }),
      );
    }
  }
  await Promise.all(tasks);
};

/* -------------------------------------------------------------------------- */
/*                              Getters Functions                             */
/* -------------------------------------------------------------------------- */

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
 * Retrieves all degrees stored in the database.
 * * @returns {Promise<DegreeSchema[]>} An array of all degrees.
 */
export const getAllDegrees = async (): Promise<DegreeSchema[]> => {
  await connect();
  const degrees = await Degree.find({}).lean<DegreeSchema[]>();
  return degrees;
};

/**
 * Retrieves all colleges stored in the database.
 * * @returns {Promise<CollegeSchema[]>} An array of all colleges.
 */
export const getAllColleges = async (): Promise<CollegeSchema[]> => {
  await connect();
  const colleges = await College.find({}).lean<CollegeSchema[]>();
  return colleges;
};

/**
 * Retrieves all departments stored in the database.
 * * @returns {Promise<DepartmentSchema[]>} An array of all departments.
 */
export const getAllDepartments = async (): Promise<DepartmentSchema[]> => {
  await connect();
  const departments = await Department.find({}).lean<DepartmentSchema[]>();
  return departments;
};

/**
 * Retrieves all departments that belong to a specific college.
 * * @param {number} college_id - The ID of the college.
 * @returns {Promise<DepartmentSchema[]>} An array of matching departments.
 */
export const getAllDepartmentsByCollegeId = async (
  college_id: number,
): Promise<DepartmentSchema[]> => {
  await connect();
  const departments = await Department.find({ college: college_id }).lean<
    DepartmentSchema[]
  >();
  return departments;
};

/**
 * Retrieves all courses that belong to a specific college.
 * Note: For large datasets, consider using pagination instead.
 * * @param {number} college_id - The ID of the college.
 * @returns {Promise<CourseSchema[]>} An array of matching courses.
 */
export const getAllCoursesByCollegeId = async (
  college_id: number,
): Promise<CourseSchema[]> => {
  await connect();
  const courses = await Course.find({ college: college_id }).lean<
    CourseSchema[]
  >();
  return courses;
};

/**
 * Retrieves all courses that belong to a specific department.
 * * @param {number} department_id - The ID of the department.
 * @returns {Promise<CourseSchema[]>} An array of matching courses.
 */
export const getAllCoursesByDepartmentId = async (
  department_id: number,
): Promise<CourseSchema[]> => {
  await connect();
  const courses = await Course.find({ department: department_id }).lean<
    CourseSchema[]
  >();
  return courses;
};

interface GetCoursesParams {
  page: number;
  limit?: number;
  filter?: Record<string, any>;
}

/**
 * Retrieves a paginated list of courses from the database.
 * Useful for displaying large directories of courses without overloading the frontend.
 *
 * @param {GetCoursesParams} params - The pagination and filtering configuration.
 * @returns {Promise<CourseSchema[]>} An array of courses for the requested page.
 */
export const getCoursesPage = async ({
  page,
  limit = 20,
  filter = {},
}: GetCoursesParams) => {
  await connect();
  const skipIndex = (page - 1) * limit;

  const courses = await Course.find(filter)
    .skip(skipIndex)
    .limit(limit)
    .lean<CourseSchema[]>();

  return courses;
};
