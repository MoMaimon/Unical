import { DegreeSchema } from "@/types/db_types";
import connect from "../db";
import Degree from "../schema/degrees";

/**
 * Retrieves a single degree by its ID.
 * @param {string} id - The ID of the degree.
 * @returns {Promise<DegreeSchema | null>} The degree object, or null if not found.
 */
export const getDegree = async (id: string): Promise<DegreeSchema | null> => {
  await connect();
  const degree = await Degree.findById(id).lean<DegreeSchema>();
  return degree;
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
