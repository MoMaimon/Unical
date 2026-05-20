import { describe, it, expect, beforeEach } from "vitest";
import Command from "../Command";
import { CourseMapper, Mapper } from "../lib/Mapper";
import PrismaConvertor from "../PrismaConvertor";
import TokenStrategy from "../TokenStrategy";

// 1. Create a Mock Mapper specifically for testing
const mapper: Mapper = CourseMapper;
describe("TokenStrategy and PrismaConvertor Integration", () => {
  let strategy: TokenStrategy;
  let convertor: PrismaConvertor;

  beforeEach(() => {
    strategy = new TokenStrategy();
    convertor = new PrismaConvertor();
  });

  it("Parses deeply nested AND/OR with relational fields and arrays", () => {
    const query =
      "?filter=(department.englishName in ['Computer Science', 'Software Engineering'] OR department.arabicName like '%حاسوب%') AND (creditHours gte 3 AND (sections.times.isOnline eq true OR sections.lecturer.name eq 'Dr. Smith')) AND updatedAt isNotNull";

    const filter = strategy.parse(convertor, query, mapper);

    // Inside TokenStrategy.test.ts -> 'Parses deeply nested AND/OR...'
    expect(filter.whereParams).toEqual({
      AND: [
        {
          AND: [
            {
              OR: [
                {
                  department: {
                    englishName: {
                      in: ["Computer Science", "Software Engineering"],
                    },
                  },
                },
                { department: { arabicName: { contains: "حاسوب" } } },
              ],
            },
            {
              AND: [
                { creditHours: { gte: 3 } },
                {
                  OR: [
                    {
                      sections: {
                        some: {
                          times: { some: { isOnline: { equals: true } } },
                        },
                      },
                    },
                    {
                      sections: {
                        some: { lecturer: { name: { equals: "Dr. Smith" } } },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        { updatedAt: { not: null } },
      ],
    });
  });

  it("Edge Case 1: Throws an error on unbalanced parenthesis", () => {
    const query =
      "?filter=(creditHours gte 3 AND department.englishName eq 'Math'";

    // Using a function wrapper so vitest can catch the thrown error
    expect(() => {
      strategy.parse(convertor, query, mapper);
    }).toThrowError(/parenthesis/i); // Expect your code to throw an error mentioning parenthesis
  });

  it("Edge Case 2: Safely ignores reserved words inside single quotes", () => {
    const query = "?filter=arabicName eq 'AND OR NOT'";

    const filter = strategy.parse(convertor, query, mapper);

    // The parser shouldn't break the string into multiple commands
    expect(filter.whereParams).toEqual({
      arabicName: { equals: "AND OR NOT" },
    });
  });

  it("Edge Case 3: Flattens useless groupings cleanly", () => {
    const query = "?filter=(((creditHours eq 3)))";

    const filter = strategy.parse(convertor, query, mapper);

    // It should not return `{ AND: [ { AND: [ { AND: [ ... ] } ] } ] }`
    expect(filter.whereParams).toEqual({
      creditHours: { equals: 3 },
    });
  });
});
