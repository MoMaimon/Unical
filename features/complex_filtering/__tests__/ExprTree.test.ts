import { describe, it, expect, beforeEach } from "vitest";
import ExprTree from "../lib/BinaryExpTree";

describe("ExprTree Parser", () => {
  let treeBuilder: ExprTree;

  beforeEach(() => {
    treeBuilder = new ExprTree();
  });

  describe("tokenize()", () => {
    it("tokenizes simple expressions", () => {
      const query = "creditHours gte 3";
      expect(treeBuilder.tokenize(query)).toEqual(["creditHours", "gte", "3"]);
    });

    it("keeps arrays intact as single tokens", () => {
      const query =
        "department in ['Computer Science', 'Software Engineering']";
      expect(treeBuilder.tokenize(query)).toEqual([
        "department",
        "in",
        "['Computer Science', 'Software Engineering']",
      ]);
    });

    it("keeps strings with special characters intact as single tokens", () => {
      const query = "department.arabicName like '%حاسوب%'";
      expect(treeBuilder.tokenize(query)).toEqual([
        "department.arabicName",
        "like",
        "'%حاسوب%'",
      ]);
    });

    it("separates parentheses correctly", () => {
      const query = "(age eq 18) AND role eq 'ADMIN'";
      expect(treeBuilder.tokenize(query)).toEqual([
        "(",
        "age",
        "eq",
        "18",
        ")",
        "AND",
        "role",
        "eq",
        "'ADMIN'",
      ]);
    });
  });

  describe("infixToPostfix() (Shunting Yard Algorithm)", () => {
    it("converts a simple expression", () => {
      const tokens = ["age", "gte", "18"];
      const postfix = treeBuilder.infixToPostfix(tokens);

      // Expected: Operand Operand Operator
      expect(postfix).toEqual(["age", "18", "gte"]);
    });

    it("respects AND / OR precedence", () => {
      const tokens = ["A", "AND", "B", "OR", "C"];
      const postfix = treeBuilder.infixToPostfix(tokens);

      // AND has higher precedence (2) than OR (1), so AND happens first
      expect(postfix).toEqual(["A", "B", "AND", "C", "OR"]);
    });

    it("handles parentheses overriding precedence", () => {
      const tokens = ["A", "OR", "(", "B", "AND", "C", ")"];
      const postfix = treeBuilder.infixToPostfix(tokens);

      expect(postfix).toEqual(["A", "B", "C", "AND", "OR"]);
    });

    it("handles Unary operators correctly (isNotNull)", () => {
      // updatedAt isNotNull AND active eq true
      const tokens = ["updatedAt", "isNotNull", "AND", "active", "eq", "true"];
      const postfix = treeBuilder.infixToPostfix(tokens);

      // isNotNull has highest precedence (4)
      expect(postfix).toEqual([
        "updatedAt",
        "isNotNull",
        "active",
        "true",
        "eq",
        "AND",
      ]);
    });

    it("successfully parses the Boss Fight string into Postfix", () => {
      // Removing the '?filter=' part as it's not part of the expression tree logic
      const query =
        "(department.englishName in ['Computer Science', 'Software Engineering'] OR department.arabicName like '%حاسوب%') AND (creditHours gte 3 AND (sections.times.isOnline eq true OR sections.lecturer.name eq 'Dr. Smith')) AND updatedAt isNotNull";

      const tokens = treeBuilder.tokenize(query);
      const postfix = treeBuilder.infixToPostfix(tokens);

      expect(postfix).toEqual([
        "department.englishName",
        "['Computer Science', 'Software Engineering']",
        "in",
        "department.arabicName",
        "'%حاسوب%'",
        "like",
        "OR", // End of first parenthesis group
        "creditHours",
        "3",
        "gte",
        "sections.times.isOnline",
        "true",
        "eq",
        "sections.lecturer.name",
        "'Dr. Smith'",
        "eq",
        "OR", // End of innermost parenthesis
        "AND", // End of second main parenthesis group
        "AND", // Connects the two main groups
        "updatedAt",
        "isNotNull",
        "AND", // Connects everything to the final isNotNull
      ]);
    });
  });
  
});

