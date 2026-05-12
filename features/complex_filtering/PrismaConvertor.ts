import Command from "./Command";
import Convertor from "./Convertor";
import Filter from "./Filter";

export default class PrismaConvertor implements Convertor {
  doForCommandWithoutValue(command: Command): Filter {
    throw new Error("Method not implemented.");
  }
  doForCommandWithValue(command: Command): Filter {
    throw new Error("Method not implemented.");
  }
}
