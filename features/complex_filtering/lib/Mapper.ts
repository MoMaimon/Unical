import Command from "../Command";

export interface Mapper {
  dictionary: Record<string, { dbField: string; type: string }>;
  translate(command: Command): string[];
}

export const CourseMapper: Mapper = class {
  static dictionary: Record<string, { dbField: string; type: string }> = {
    code: { dbField: "courseCode", type: "string" },
    arabicName: { dbField: "arabicName", type: "string" },
    englishName: { dbField: "englishName", type: "string" },
    credits: { dbField: "creditHours", type: "number" },

    department: { dbField: "department.englishName", type: "string" },
    lecturer: { dbField: "sections.lecturer.name", type: "string" },
    isOnline: { dbField: "sections.times.isOnline", type: "boolean" },
  };

  static translate(command: Command): any[] {
    const mapRule = this.dictionary[command.property];
    if (!mapRule) {
      throw new Error(`Invalid filter property: ${command.property}`);
    }

    command.property = mapRule.dbField;
    let val: any = command.value;

    if (val !== undefined && val !== null) {
      if (val === "true") {
        val = true;
      } else if (val === "false") {
        val = false;
      } else if (mapRule.type === "number") {
        val = Number(val);
        if (isNaN(val))
          throw new Error(`Property ${command.property} must be a number`);
      }
    }

    return [command.property, command.operator, val];
  }
};
