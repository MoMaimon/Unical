import connect from "../db";
import { SectionSchema } from "../db_types";
import Course from "../models/courses";
import Section from "../models/sections";
import { getByPage, PaginationParams } from "./util/repo_util";

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

export const getSectionsPage = async ({
  page,
  limit = 20,
  filter = {},
}: PaginationParams) => {
  const sections = getByPage(Section, {
    page: page,
    limit: limit,
    filter: filter,
  });

  return sections;
};
