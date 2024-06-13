export interface QueryLoadMassive {
  license: string;
  file_name: string;
  country_code: any;
  packages: Array<number>;
  file: string;
  connection_id: string;
}

export interface ReloadMassive {
  batch: number;
  document_id: string;
}

export interface ProgressReport {
  country: string;
  company_name: string;
  document_id: string;
  loaded_file: string;
}

export interface LoadMassiveDocument {
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
  create_date: Date;
  create_time: string;
  end_date: Date;
  last_modify: string;
  created_by: string;
  user_name: string;
  modify_by: string;
  client_id: number;
  client_name: string;
  document_list: string[];
  packages: number[];
  current_batch_ix_running: number;
}
