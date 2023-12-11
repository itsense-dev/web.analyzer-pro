import { TypeOfPerson } from 'src/enum/type-of-person.enum';

export interface Package {
  package_id: number;
  subscription_id: string;
  name: string;
  queries_assigned: number;
  queries_available: number;
  person_type: TypeOfPerson;
  country_id: string;
  checked: boolean;

  extra_params: PackageExtraParam[];
}

export interface PackageExtraParam {
  translate_key: string;
  param_key: string;
  data_type: string;
  mask: string;
  pattern: string;
  placeholder: string;
  products_names: string[];
}

export enum ExtraParamDataType {
  DATE = 'date',
  TEXT = 'text',
}
