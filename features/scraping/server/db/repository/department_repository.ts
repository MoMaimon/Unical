import { DepartmentSchema } from "@/types/db_types";
import connect from "../db";
import Department from "../schema/departments";

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
