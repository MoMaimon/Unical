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
    let val: any = (command as any).value;
    
    if (val === 'true') {
      val = true;
    } else if (val === 'false') {
      val = false;
    } else if (val !== null && val !== undefined && typeof val === 'string' && val.trim() !== '') {
      if (!isNaN(Number(val))) {
        val = Number(val);
      }
    }
    
    return [(command as any).property, (command as any).operator, val];
  }
};
