import pLimit from "p-limit";
import connect from "@/lib/db/db";
import College from "@/lib/db/models/colleges";
import Degree from "@/lib/db/models/degrees";
import Department from "@/lib/db/models/departments";
import { fetchAndSave, getPagesCount } from "@/lib/Scraping/scrape";
import Course from "@/lib/db/models/courses";
import {
  collegeResponse,
  courseResponse,
  degreeResponse,
  departmentResponse,
} from "./scrape_types";

const getCollegesIds = async (): Promise<Array<number>> => {
  await connect();
  return await College.distinct("_id");
};

const getDegreesIds = async (): Promise<Array<number>> => {
  await connect();
  return await Degree.distinct("_id");
};

const getDepartmentsIds = async (
  college_id: number,
): Promise<Array<number>> => {
  await connect();
  return await Department.distinct("_id", { college: college_id });
};

/* -------------------------------------------------------------------------- */
/*                              Syncing Functions                             */
/* -------------------------------------------------------------------------- */

export const syncDegrees = async () => {
  await fetchAndSave("getDegrees", Degree);
};

export const syncColleges = async () => {
  await fetchAndSave("getColleges", College);
};

export const syncDepartments = async () => {
  const colleges = await getCollegesIds();
  for (const college of colleges) {
    await fetchAndSave("getDepartments", Department, 1, {
      data: "departments",
      params: { college_id: college },
    });
  }
};

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
            await fetchAndSave("getCourses", Course, 4, {
              data: "courses",
              params: {
                degree_id: degree,
                college_id: college,
                department_id: department,
                page: i,
              },
            });
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

export const getDegree = async (id: number): Promise<degreeResponse | null> => {
  await connect();
  const degree = await Degree.findById(id).lean<degreeResponse>();
  return degree;
};

export const getCollege = async (
  id: number,
): Promise<collegeResponse | null> => {
  await connect();
  const college = await College.findById(id).lean<collegeResponse>();
  return college;
};

export const getDepartment = async (
  id: number,
): Promise<departmentResponse | null> => {
  await connect();
  const department = await Department.findById(id).lean<departmentResponse>();
  return department;
};

export const getCourse = async (id: number): Promise<courseResponse | null> => {
  await connect();
  const course = await Course.findById(id).lean<courseResponse>();
  return course;
};

export const getAllDegrees = async (): Promise<degreeResponse[]> => {
  await connect();
  const degrees = await Degree.find({}).lean<degreeResponse[]>();
  return degrees;
};

export const getAllColleges = async (): Promise<collegeResponse[]> => {
  await connect();
  const colleges = await College.find({}).lean<collegeResponse[]>();
  return colleges;
};

export const getAllDepartments = async (): Promise<departmentResponse[]> => {
  await connect();
  const departments = await Department.find({}).lean<departmentResponse[]>();
  return departments;
};

export const getAllDepartmentsByCollegeId = async (
  college_id: number,
): Promise<departmentResponse[]> => {
  await connect();
  const departments = await Department.find({ college: college_id }).lean<
    departmentResponse[]
  >();
  return departments;
};

export const getAllCoursesByCollegeId = async (
  college_id: number,
): Promise<courseResponse[]> => {
  await connect();
  const courses = await Course.find({ college: college_id }).lean<
    courseResponse[]
  >();
  return courses;
};

export const getAllCoursesByDepartmentId = async (
  department_id: number,
): Promise<courseResponse[]> => {
  await connect();
  const courses = await Course.find({ department: department_id }).lean<
    courseResponse[]
  >();
  return courses;
};

export const getCoursesPage = async (page: number, limit: number = 20) => {
  await connect();
  const skipIndex = (page - 1) * limit;

  const courses = await Course.find({})
    .skip(skipIndex)
    .limit(limit)
    .lean<courseResponse[]>();

  return courses;
};
