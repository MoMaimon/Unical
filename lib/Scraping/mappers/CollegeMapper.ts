import { CollegeApiResponse } from "../scrape_types";
import { config } from "../config";

export class CollegeMapper {
  static toUpsert(college: CollegeApiResponse) {
    const idNum = Number(college.id);
    if (config.scraping.collegeBlacklist.includes(idNum)) {
      return null;
    }
    return {
      updateOne: {
        filter: { _id: idNum },
        update: { $set: { name: college.name } },
        upsert: true,
      },
    };
  }
}