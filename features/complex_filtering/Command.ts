import Convertor from "./Convertor";

export default class Command {
  private property: string;
  private operator: string;
  private value: string;

  constructor(property: string, operator: string, value: string) {
    this.property = property;
    this.operator = operator;
    this.value = value;
  }

  accept(convertot: Convertor) {
    throw new Error("Method not implemented.");
  }
}
