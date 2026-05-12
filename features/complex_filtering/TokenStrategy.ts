import Convertor from "./Convertor";
import Filter from "./Filter";
import Startegy from "./Strategy";

export default class TokenStrategy implements Startegy {
  parse(convertor: Convertor): Filter {
    throw new Error("Method not implemented.");
  }
}
