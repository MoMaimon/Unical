import { CollegeSchema } from "@/types/db_types";
import College from "../schema/colleges";
import connect from "../db";

/**
 * Retrieves a single department by its ID.
 * @param {string} id - The ID of the department.
 * @returns {Promise<DepartmentSchema | null>} The department object, or null if not found.
 */
export const getCollege = async (id: string): Promise<CollegeSchema | null> => {
  await connect();
  const college = await College.findById(id).lean<CollegeSchema>();
  return college;
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
