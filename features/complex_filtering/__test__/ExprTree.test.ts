import { describe, it, expect, beforeEach } from "vitest";
import { ExprTree, TreeNode } from "../lib/BinaryExpTree";

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

    it("handles negative numbers", () => {
      const query = "creditHours eq -3";
      expect(treeBuilder.tokenize(query)).toEqual(["creditHours", "eq", "-3"]);
    });

  });

  describe("infixToPostfix()", () => {
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
        "OR",
        "creditHours",
        "3",
        "gte",
        "sections.times.isOnline",
        "true",
        "eq",
        "sections.lecturer.name",
        "'Dr. Smith'",
        "eq",
        "OR",
        "AND",
        "AND",
        "updatedAt",
        "isNotNull",
        "AND",
      ]);
    });
  });

  describe("getExprTree() (Building the AST)", () => {
    it("builds a simple binary tree", () => {
      const query = "creditHours gte 3";
      const tree = treeBuilder.getExprTree(query);

      expect(tree).toEqual(
        new TreeNode("gte", new TreeNode("creditHours"), new TreeNode("3")),
      );
    });

    it("builds a tree with AND/OR logic", () => {
      const query = "age eq 18 AND role eq 'ADMIN'";
      const tree = treeBuilder.getExprTree(query);

      expect(tree).toEqual(
        new TreeNode(
          "AND",
          new TreeNode("eq", new TreeNode("age"), new TreeNode("18")),
          new TreeNode("eq", new TreeNode("role"), new TreeNode("'ADMIN'")),
        ),
      );
    });

    it("handles Unary operators (isNotNull) as single-child nodes", () => {
      const query = "updatedAt isNotNull";
      const tree = treeBuilder.getExprTree(query);

      // Unary operators usually put the operand on the left, and right stays null
      expect(tree).toEqual(
        new TreeNode("isNotNull", new TreeNode("updatedAt"), null),
      );
    });

    it("honors parenthesis groupings in the final tree", () => {
      // If precedence breaks, AND would be the root. With parenthesis, OR is the root.
      const query = "(A eq 1 AND B eq 2) OR C eq 3";
      const tree = treeBuilder.getExprTree(query);

      expect(tree?.value).toBe("OR");
      expect(tree?.left?.value).toBe("AND");
      expect(tree?.right?.value).toBe("eq");
      expect(tree?.right?.left?.value).toBe("C");
    });

    it("AST Precedence: handles 'isNull' as a unary operator", () => {
      const query = "deletedAt isNull";
      const tree = treeBuilder.getExprTree(query);
      
      expect(tree?.value).toBe("isNull");
      expect(tree?.left?.value).toBe("deletedAt");
      expect(tree?.right).toBeNull();
    });
  });
});
