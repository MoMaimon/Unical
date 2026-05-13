import Command from "./Command";
import Convertor from "./Convertor";
import Filter from "./Filter";

export default class PrismaConvertor implements Convertor {
  // A dictionary to translate your API operators to Prisma's specific keywords
  private operatorMap: Record<string, string> = {
    eq: "equals",
    neq: "not",
    gte: "gte",
    lte: "lte",
    gt: "gt",
    lt: "lt",
    like: "contains",
    in: "in",
  };

  doForCommandWithValue(command: Command): Filter {
    const property = command.property;
    const operator = command.operator;
    let value = command.value;

    // --- Data Cleanup ---
    // Handle arrays (e.g. "['CS', 'SE']" -> ["CS", "SE"])
    if (operator === "in" && typeof value === "string") {
      value = value
        .replace(/[\[\]']/g, "")
        .split(",")
        .map((s) => s.trim()) as any;
    }
    // Strip surrounding single quotes from strings (e.g. "'Dr. Smith'" -> "Dr. Smith")
    else if (typeof value === "string" && value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1) as any;
    }

    // --- Prisma Mapping ---
    const prismaOperator = this.operatorMap[operator] || operator;

    // Strip SQL wildcard '%' for 'contains' because Prisma does that automatically
    if (prismaOperator === "contains" && typeof value === "string") {
      value = value.replace(/%/g, "") as any;
    }

    // Wrap in the Prisma syntax
    const condition = { [prismaOperator]: value };

    // Build relationships if needed and return the Filter
    return new Filter(this.buildNestedObject(property, condition));
  }

  doForCommandWithoutValue(command: Command): Filter {
    const property = command.property;
    const operator = command.operator;

    let condition = {};
    if (operator === "isNotNull") {
      condition = { not: null };
    } else if (operator === "isNull") {
      condition = { equals: null };
    }

    return new Filter(this.buildNestedObject(property, condition));
  }

  /**
   * Helper function to turn dot-notation ("sections.lecturer.name") 
   * into deeply nested Prisma relation objects.
   */
  private buildNestedObject(propertyPath: string, condition: any): Record<string, any> {
    const keys = propertyPath.split(".");
    let result = condition;

    // Loop backwards through the keys
    for (let i = keys.length - 1; i >= 0; i--) {
      const key = keys[i];

      if (i === keys.length - 1) {
        // The last key is always the field name (e.g., "name", "creditHours")
        result = { [key]: result };
      } else {
        // If it's a relationship, we need to know if it's a list (many) or a single object.
        // TRICK: In English/Prisma schemas, plural relations usually end in "s" (sections, times).
        if (key.endsWith("s")) {
          // If plural, wrap in Prisma's `some` operator
          result = { [key]: { some: result } };
        } else {
          // If singular (department, lecturer), nest directly
          result = { [key]: result };
        }
      }
    }
    return result;
  }
}