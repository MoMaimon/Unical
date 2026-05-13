import Convertor from "./Convertor";
import Filter from "./Filter";
import { Mapper } from "./lib/Mapper";
import Startegy from "./Strategy";
// ?filter=(department.englishName in ['Computer Science', 'Software Engineering'] OR department.arabicName like '%حاسوب%') AND (creditHours gte 3 AND (sections.times.isOnline eq true OR sections.lecturer.name eq 'Dr. Smith')) AND updatedAt isNotNull
export default class TokenStrategy implements Startegy {
    
  parse(convertor: Convertor, queryFilter: string, mapper: Mapper): Filter {
    throw new Error("Method not implemented.");
  }
}
