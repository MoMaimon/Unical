import { describe, it, expect, beforeEach } from 'vitest';
import Command from '../Command';
import { Mapper } from '../lib/Mapper';
import PrismaConvertor from '../PrismaConvertor';
import TokenStrategy from '../TokenStrategy';

// 1. Create a Mock Mapper specifically for testing
const MockMapper: Mapper = class {
  static dictionary = {
    "department.englishName": { dbField: "department.englishName", type: "string" },
    "department.arabicName": { dbField: "department.arabicName", type: "string" },
    "creditHours": { dbField: "creditHours", type: "number" },
    "sections.times.isOnline": { dbField: "sections.times.isOnline", type: "boolean" },
    "sections.lecturer.name": { dbField: "sections.lecturer.name", type: "string" },
    "updatedAt": { dbField: "updatedAt", type: "string" },
    "arabicName": { dbField: "arabicName", type: "string" },
  };

  static translate(command: Command): string[] {
    // For simplicity in the test, we bypass full translation logic 
    // and just return the raw property, operator, and value to simulate a successful pass-through.
    // In your real code, this would check the dictionary and cast types.
    return [(command as any).property, (command as any).operator, (command as any).value];
  }
};

describe('TokenStrategy and PrismaConvertor Integration', () => {
  let strategy: TokenStrategy;
  let convertor: PrismaConvertor;

  beforeEach(() => {
    strategy = new TokenStrategy();
    convertor = new PrismaConvertor();
  });

  it('Parses deeply nested AND/OR with relational fields and arrays', () => {
    const query = "?filter=(department.englishName in ['Computer Science', 'Software Engineering'] OR department.arabicName like '%حاسوب%') AND (creditHours gte 3 AND (sections.times.isOnline eq true OR sections.lecturer.name eq 'Dr. Smith')) AND updatedAt isNotNull";
    
    const filter = strategy.parse(convertor, query, MockMapper);

    // This asserts the final exact Prisma Object shape expected from the Convertor
    expect(filter.whereParams).toEqual({
      AND: [
        {
          OR: [
            // Assuming 'in' translates to Prisma's 'in'
            { department: { englishName: { in: ['Computer Science', 'Software Engineering'] } } },
            // Assuming 'like' translates to Prisma's 'contains'
            { department: { arabicName: { contains: 'حاسوب' } } } 
          ]
        },
        {
          AND: [
            // Assuming 'gte' translates to Prisma's 'gte'
            { creditHours: { gte: 3 } },
            {
              OR: [
                // Assuming boolean casting and deep relations
                { sections: { some: { times: { some: { isOnline: { equals: true } } } } } },
                { sections: { some: { lecturer: { name: { equals: 'Dr. Smith' } } } } }
              ]
            }
          ]
        },
        // Unary operator checking state without a value
        { updatedAt: { not: null } }
      ]
    });
  });

  it('Edge Case 1: Throws an error on unbalanced parenthesis', () => {
    const query = "?filter=(creditHours gte 3 AND department.englishName eq 'Math'";
    
    // Using a function wrapper so vitest can catch the thrown error
    expect(() => {
      strategy.parse(convertor, query, MockMapper);
    }).toThrowError(/parenthesis/i); // Expect your code to throw an error mentioning parenthesis
  });

  it('Edge Case 2: Safely ignores reserved words inside single quotes', () => {
    const query = "?filter=arabicName eq 'AND OR NOT'";
    
    const filter = strategy.parse(convertor, query, MockMapper);

    // The parser shouldn't break the string into multiple commands
    expect(filter.whereParams).toEqual({
      arabicName: { equals: 'AND OR NOT' }
    });
  });

  it('Edge Case 3: Flattens useless groupings cleanly', () => {
    const query = "?filter=(((creditHours eq 3)))";
    
    const filter = strategy.parse(convertor, query, MockMapper);

    // It should not return `{ AND: [ { AND: [ { AND: [ ... ] } ] } ] }`
    expect(filter.whereParams).toEqual({
      creditHours: { equals: 3 }
    });
  });
});