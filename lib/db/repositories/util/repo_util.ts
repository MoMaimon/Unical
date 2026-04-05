import { Model } from "mongoose";
import connect from "../../db";

export interface PaginationParams {
  page: number;
  limit?: number;
  filter?: Record<string, any>;
}

export const getByPage = async <T>(
  model: Model<any>,
  { page, limit = 20, filter = {} }: PaginationParams,
) => {
  await connect();
  const skipIndex = (page - 1) * limit;

  const data = await model
    .find(filter)
    .skip(skipIndex)
    .limit(limit)
    .lean<T[]>();

  return data;
};
