import { Course } from "./course";
import { Section } from "./section";

export class Schedule {
  #courses = new Map<Course, Section>();

  get courses() {
    return [...this.#courses.keys()];
  }

  addSection(section: Section) {
    this.#courses.set(section.course, section);
  }

  deleteCourse(course: Course) {
    this.#courses.delete(course);
  }

  deleteSection(section: Section) {
    this.#courses.delete(section.course);
  }
}
