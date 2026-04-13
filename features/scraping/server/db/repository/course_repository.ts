import { PaginationParams, getByPage } from "@/features/scraping/lib/repo_util";
import { CourseSchema } from "@/types/db_types";
import connect from "../db";
import Course from "../schema/courses";

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
  const courses = getByPage(Course, {
    page: page,
    limit: limit,
    filter: filter,
  });

  return courses;
};
