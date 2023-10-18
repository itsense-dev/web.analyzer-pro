export interface ResponseApiAnalyzer {
  statusCode: number;
  request_id: string;
  message: string;
  user_info: UserInfo;
  countries: Countries[];
  errorMessage?: string;
}

export interface UserInfo {
  user_id: string;
  user_name: string;
  user_email: string;
  client_id: number;
  client_name: string;
  plan_id: string;
  plan_name: string;
}

export interface Countries {
  country_id: string;
  country_name: string;
}

export interface packagesByPlan {
  code: number;
  message: string;
  data: packagesByPlanData[];
}

export interface packagesByPlanData {
  plan_id: number;
  package_id: number;
  name: string;
  active_record: string;
}
