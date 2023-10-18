import { TypeOfPerson } from 'src/enum/type-of-person.enum';

export interface Package {
  package_id: number;
  subscription_id: string;
  name: string;
  queries_assigned: number;
  queries_available: number;
  person_type: TypeOfPerson;
  checked: boolean;
}
