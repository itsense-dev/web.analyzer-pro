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

export interface PackageRecord {
  id: number;
  name: string;
  person_type: string;
  country_id: string;
  description: string;
  created_user: string;
  created_date: string;
  last_updated_user: string;
  last_updated_date: string;
  active_record: string;
}

export interface PlanPackage {
  package_id: number;
  plan_id: number;
  name: string;
}

export interface PlanPackagePriced {
  package_id: number;
  n_bought_queries?: number;
  final_total_price?: number;
}

export interface CalculatePackagePrice {
  package_id: number;
  number_queries: number;
}
