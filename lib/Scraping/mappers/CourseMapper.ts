import { CourseApiResponse } from "../scrape_types";

export class CourseMapper {
  static toUpsert(
    course: CourseApiResponse,
    collegeId: number,
    degreeId: number,
    departmentId: number
  ) {
    return {
      updateOne: {
        filter: { _id: course.no },   // course.no is string, matches your Course _id (String)
        update: {
          $set: {
            name: course.name,
            college: collegeId,
            degree: degreeId,
            department: departmentId,
            hours: Number(course.hours),
          },
        },
        upsert: true,
      },
    };
  }
}