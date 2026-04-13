import { SectionSchema } from "../../../types/db_types";
import { Course } from "../schema/course";
import { Section } from "../schema/section";
import { SectionTime } from "../schema/section_time";


export class CourseService {
  #courses: Course[];

  constructor(courses: Course[]) {
    this.#courses = courses;
  }

  get courses() {
    return this.#courses;
  }

  loadCourses(
    rawCourses: Array<{
      _id: string;
      name: string;
      degree: {
        _id: number;
        name: string;
      };
      college: {
        _id: number;
        name: string;
      };
      department: {
        _id: number;
        name: string;
      };
      hours: number;
    }>,
    rawSections: SectionSchema[],
  ) {
    const courseMap = new Map<string, Course>();
    for (const raw of rawCourses) {
      const course = new Course(
        raw._id,
        raw.name,
        { id: raw.degree._id.toString(), name: raw.degree.name },
        { id: raw.college._id.toString(), name: raw.college.name },
        { id: raw.department._id.toString(), name: raw.department.name },
        raw.hours,
      );
      courseMap.set(course.id, course);
    }

    for (const raw of rawSections) {
      const parentCourse = courseMap.get(raw.courseNo);
      if (!parentCourse) continue;

      const times = raw.schedules.map(
        (t) =>
          new SectionTime(
            t.days,
            t.startTime,
            t.endTime,
            t.startMinutes,
            t.endMinutes,
            t.room,
            t.isOnline,
          ),
      );
      const section = new Section(
        raw._id,
        raw.status,
        parentCourse,
        raw.lecturers,
        times,
        raw.isFullyOnline,
      );

      parentCourse.addSection(section);
    }

    this.#courses = [...courseMap.values()];
  }
}
