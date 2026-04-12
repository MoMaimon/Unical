import { DegreeApiResponse } from "../scrape_types";

export class DegreeMapper {
  static toUpsert(degree: DegreeApiResponse) {
    return {
      updateOne: {
        filter: { _id: Number(degree.id) },   // convert string to number
        update: { $set: { name: degree.name } },
        upsert: true,
      },
    };
  }
}