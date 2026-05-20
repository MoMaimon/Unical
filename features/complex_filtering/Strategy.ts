import Convertor from "./Convertor";
import Filter from "./Filter";
import { Mapper } from "./lib/Mapper";

export default interface Startegy {
  parse(convertor: Convertor, queryFilter: string, mapper: Mapper): Filter;
}
