import { DepartmentApiResponse } from "../scrape_types";

export class DepartmentMapper {
  static toUpsert(department: DepartmentApiResponse, collegeId: number) {
    return {
      updateOne: {
        filter: { _id: Number(department.id) },
        update: { $set: { name: department.name, college: collegeId } },
        upsert: true,
      },
    };
  }
}