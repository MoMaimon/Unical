import { Section } from "./section";

type metaData = {
  id: string;
  name: string;
};

export class Course {
  #id: string;
  #name: string;
  #degree: metaData;
  #college: metaData;
  #department: metaData;
  #hours: number;
  #sections: Section[] = [];

  constructor(
    id: string,
    name: string,
    degree: metaData,
    college: metaData,
    department: metaData,
    hours: number,
  ) {
    this.#id = id;
    this.#name = name;
    this.#degree = degree;
    this.#college = college;
    this.#department = department;
    this.#hours = hours;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get degree() {
    return this.#degree;
  }

  get college() {
    return this.#college;
  }

  get department() {
    return this.#department;
  }

  get hours() {
    return this.#hours;
  }

  get sections() {
    return this.#sections;
  }

  addSection(section: Section) {
    this.#sections.push(section);
  }

  deleteSection(section: Section) {
    const index = this.#sections.indexOf(section);
    this.#sections.splice(index, 1);
  }
}
