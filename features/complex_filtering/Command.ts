import Convertor from "./Convertor";
import { Mapper } from "./lib/Mapper";

export default class Command {
  private property: string;
  private operator: string;
  private value: string;

  constructor(property: string, operator: string, value: string) {
    this.property = property;
    this.operator = operator;
    this.value = value;
  }

  accept(convertor: Convertor, mapper: Mapper) {
    [this.property, this.operator, this.value] = mapper.translate(this);
    if (this.value === null || this.value === undefined) {
      return convertor.doForCommandWithoutValue(this);
    } else {
      return convertor.doForCommandWithValue(this);
    }
  }
}
