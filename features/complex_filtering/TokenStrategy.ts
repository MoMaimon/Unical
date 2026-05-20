import Command from "./Command";
import Convertor from "./Convertor";
import Filter from "./Filter";
import { ExprTree, TreeNode } from "./lib/BinaryExpTree";
import { Mapper } from "./lib/Mapper";
import Startegy from "./Strategy";

// ?filter=(department.englishName in ['Computer Science', 'Software Engineering'] OR department.arabicName like '%حاسوب%') AND (creditHours gte 3 AND (sections.times.isOnline eq true OR sections.lecturer.name eq 'Dr. Smith')) AND updatedAt isNotNull
export default class TokenStrategy implements Startegy {
  parse(convertor: Convertor, queryFilter: string, mapper: Mapper): Filter {
    const cleanQuery = queryFilter.replace("?filter=", "");

    const exprTree = new ExprTree();
    const root: TreeNode = exprTree.getExprTree(cleanQuery)!;

    return this.evaluateTree(root, convertor, mapper);
  }

  private evaluateTree(node: TreeNode | null, convertor: Convertor, mapper: Mapper): Filter {
    if (!node) {
      return new Filter({}); 
    }

    if (node.value === "AND" || node.value === "OR") {
      const leftFilter = this.evaluateTree(node.left, convertor, mapper);
      const rightFilter = this.evaluateTree(node.right, convertor, mapper);

      return new Filter({
        [node.value]: [leftFilter.whereParams, rightFilter.whereParams]
      });
    }

    
    const property = node.left?.value || "";
    const operator = node.value;
    
    const value = node.right?.value || null; 

    const command = new Command(property, operator, value as any);

    return command.accept(convertor, mapper);
  }
}