export class TreeNode {
  value: string;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(
    value: string,
    left: TreeNode | null = null,
    right: TreeNode | null = null,
  ) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

class Stack<T> {
  items: T[];
  constructor() {
    this.items = [];
  }

  push(element: T) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  print() {
    console.log(this.items);
  }
}
export class ExprTree {
  private precedence: Record<string, number> = {
    isNotNull: 4,
    in: 3,
    like: 3,
    gte: 3,
    eq: 3,
    AND: 2,
    OR: 1,
  };

  getExprTree(query: string) {
    const stack = new Stack<TreeNode>();
    const tokens = this.tokenize(query);
    const postfix = this.infixToPostfix(tokens);

    postfix.forEach((token) => {
      if (!(token in this.precedence)) {
        stack.push(new TreeNode(token));
      } else {
        if (token === "isNotNull") {
          const leftNode = stack.pop();
          stack.push(new TreeNode(token, leftNode));
        } else {
          const rightNode = stack.pop();
          const leftNode = stack.pop();

          stack.push(new TreeNode(token, leftNode, rightNode));
        }
      }
    });

    return stack.pop();
  }

  infixToPostfix(tokens: string[]) {
    const output: string[] = [];
    const operatorStack = new Stack<string>();

    tokens.forEach((token) => {
      if (token === "(") {
        operatorStack.push(token);
      } else if (token === ")") {
        while (operatorStack.peek() !== "(") {
          const operator = operatorStack.pop();
          if (operator === null || operator === undefined) {
            throw Error("incorrect query formatting.");
          }
          output.push(operator);
        }
        operatorStack.pop();
      } else if (this.precedence[token] !== undefined) {
        while (
          !operatorStack.isEmpty() &&
          operatorStack.peek() !== "(" &&
          this.precedence[operatorStack.peek()!] >= this.precedence[token]
        ) {
          output.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      } else {
        output.push(token);
      }
    });

    while (!operatorStack.isEmpty()) {
      const op = operatorStack.pop();
      if (op === "(" || op === ")") {
        throw new Error("unbalanced parenthesis");
      }
      output.push(op!);
    }

    return output;
  }

  tokenize(expression: string) {
    const regex = /\[.*?\]|'.*?'|\(|\)|[A-Za-z0-9_.]+/g;
    return expression.match(regex) || [];
  }
}
