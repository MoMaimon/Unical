import { Course } from "./course";
import { SectionTime } from "./section_time";

export class Section {
  #id: string;
  #status: number;
  #course: Course;
  #lecturer: string;
  #times: SectionTime[];
  #isFullyOnline: boolean;

  constructor(
    id: string,
    status: number,
    course: Course,
    lecturer: string,
    times: SectionTime[],
    isFullyOnline: boolean,
  ) {
    this.#id = id;
    this.#status = status;
    this.#course = course;
    this.#lecturer = lecturer;
    this.#times = times;
    this.#isFullyOnline = isFullyOnline;
  }

  get id() {
    return this.#id;
  }

  get status() {
    return this.#status;
  }

  get isOpen() {
    return this.#status == 1;
  }

  get course() {
    return this.#course;
  }

  get lecturer() {
    return this.#lecturer;
  }

  get times() {
    return this.#times;
  }

  get startTime() {
    const startTimes: Set<string> = new Set();
    this.#times.forEach((value) => {
      startTimes.add(value.startTime);
    });
    return [...startTimes];
  }

  get endTime() {
    const endTimes: Set<string> = new Set();
    this.#times.forEach((value) => {
      endTimes.add(value.endTime);
    });
    return [...endTimes];
  }

  get days() {
    const days: number[] = [];
    this.#times.forEach((value) => {
      days.push(...value.days);
    });
    return days;
  }

  get isFullyOnline() {
    return this.#isFullyOnline;
  }

  hasConflict(other: Section) {
    for (const time of this.#times) {
      for (const otherTime of other.times) {
        if (time.hasConflict(otherTime)) {
          return true;
        }
      }
    }
    return false;
  }
}
