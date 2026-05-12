import Convertor from "./Convertor";
import Filter from "./Filter";

export default interface Startegy {
  parse(convertor: Convertor): Filter;
}
