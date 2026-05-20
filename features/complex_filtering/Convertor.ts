import Command from "./Command";
import Filter from "./Filter";

export default interface Convertor {
  doForCommandWithoutValue(command: Command): Filter;
  doForCommandWithValue(command: Command): Filter;
}
