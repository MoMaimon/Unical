import Command from "../Command";

export interface Mapper {
  dictionary: Record<string, { dbField: string; type: string }>;
  translate(command: Command): string[];
}

export const CourseMapper: Mapper = class {
  static dictionary = {
    code: { dbField: "courseCode", type: "string" },
    credits: { dbField: "creditHours", type: "number" },
  };

  static translate(command: Command): string[] {
    throw new Error("Method not implemented.");
  }
};
