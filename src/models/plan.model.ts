export interface Plan {
  plan_id: number;
  plan_name: string;
  description: string;
  user_count: number;
  subscription_id: string;
  client_id: number;
  subscription_date: Date;
  state: number;
  end_date: Date;
  subscription_cost: number;
  subscription_type: number;
  queries_available: number;
  queries_assigned: number;
}
