export interface ResponseGlobal<T> {
  status: number;
  message: string;
  data: T;
  body?: T;
}
export interface ResponseGlobal2<T> {
  code: number;
  message: string;
  data: T;
}
export interface Person {
  key: string;
  name: string;
  state: boolean;
  address: string;

  active_record: string;
  assigned_user: number;
  client_id: number;
}

export interface Clients {
  client_id: number;
  name: string;
  active_record: string;
  assigned_user: number;
  logo?: string;
}

export interface NewClient {
  state_id?: number;
  city_id?: number;
  identification_type: string;
  name: string;
  country_id: string;
  address: string;
  contact_phone_number: string;
  contact_email: string;
  zip_code: string;
  website_url: string;
  business_type: string;
  description: string;
  document_number: string;

  active_record?: string;
  logo?: string;
  subscriptions: Plan[];
}
export interface Plan {
  indexOf(arg0: string): unknown;
  subscription_id: string;
  plan_id: number;
  plan_name: string;
  subscription_date: string;
  due_date_plan: string;
  plan_description: string;
  subscription_status?: string;
  subscription_due_date?: string;
  client_id: number;
}
export interface LabelValue {
  label: string;
  value: number;
  checked?: boolean;
}
export interface LabelValueString {
  label: string;
  value: string;
}

export interface Countries {
  country_id: string;
  country_name: string;
}

export interface Idtypes {
  id: string;
  id_type: string;
}
export interface States {
  id: string;
  state_name: string;
}

export interface Cities {
  city_id: number;
  city_name: string;
  country_id: string;
  cod_dane?: string;
}
export interface Rols {
  rol_id: number;
  rol_name: string;
}

export interface GlobalResponse {
  statusCode: number;
  message: string;
  data: Users[];
}

export interface Users {
  user_id: string;
  logo: string | null;
  n_assigned_queries: number;
  n_consumed_queries: number;
  n_remaining_queries: number;
  name: string;
  active_record: string;
  user_position?: string;
}
export interface UserDetails {
  user_id: string;
  name: string;
  email: string;
  rol_id: number;
  subscription_id: string[];
  user_position: string;
  phone_number: string;
  address: string;
  client_name: string;
  active_record?: string;
  logo: string;
  client_id: number;
  plans: Plan[];
}
export interface UserDetails2 {
  user_id: string;
  name: string;
  email: string;
  user_creation_date: string;
  last_updated_date: string;
  last_updated_user: string;
  rol_id: number;
  logo: string;
}
export interface usersPlan {
  plan_name: string;
  package_name: string;
  assigned_queries: number;
  consumed_queries: number;
  remaining_queries: number;
}
export interface CountryProducts {
  product_id: number;
  product_name: string;
}
export interface Item {
  id: number;
  name: string;
}
export interface HistoryIndividualFilter {
  country_code: string;
  key_word: string | null;
  start_date: string | null;
  final_date: string | null;
  client_name: string | null;
}

export interface HistoryMassiveFilter {
  key_word: string | null;
  start_date: string | null;
  final_date: string | null;
  client_id: string | null;
  is_finished: boolean;
}

export interface IndividualHistory {
  country: string;
  index_name: string;
  consult_id: string;
  consult_name: string;
  person_type: string;
  id_type: string;
  id_number: string;
  consult_date: string;
  search_datetime: string;
  report_generated_by: string;
}

export interface MassiveHistory {
  load_massive_document_id: string;
  loadMassive_id: number;
  subscription_id: string;
  country_id: string;
  country_name: string;
  plan_id: number;
  plan_name: string;
  url_file: string;
  file_name: string;
  download_url: string;
  progress: number;
  total_queries: number;
  total_executed: number;
  total_successful: number;
  sent_email: boolean;
  observation: string;
  status: number;
  create_date: string;
  create_time: string;
  end_date: string;
  is_finished: boolean;
  last_modify: string;
  created_by: string;
  user_name: string;
  modify_by: string;
  client_id: number;
  client_name: string;
  document_list: Document[];
  packages: number[];
}

export interface Document {
  id: string;
  order: string;
}

export interface GlobalHistory<T> {
  history_list: T;
  total_rows: number;
  page: number;
  size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PackageRange {
  min_range: number;
  max_range: number;
  price: number;
}

export interface NewProduct {
  name: string;
  description: string;
  person_type: number;
  country_id: string;
  lists: number[];
  ranges: PackageRange[] | null;
  file: string | null;
  is_load_massive: boolean;
}

export interface PersonType {
  id: number;
  id_type: string;
  description: string;
  person_type?: number;
  mask: string;
  pattern: string | null;
  placeholder: string;
  person_type_name: string;
}

export interface Packages {
  package_id: number;
  package_name: string;
}

export interface NewPlan {
  name: string;
  description: string;
  user_numer: number;
  products: number[];
}
