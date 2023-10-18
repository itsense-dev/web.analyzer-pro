export interface PanelList {
  active: boolean;
  disabled: boolean;
  statusCode: number;
  name: string;
  body: BodyList;
  position: number;
  product_url: string;
  request_product_id: string;
  finding: false;
}

export interface BodyList {
  date: string;
  countryCode: string;
  name: string;
  time: string;
  message: any;
  url: string;
  request_detail: RequestDetail;
  statusCode: number;
}

export interface RequestDetail {
  country: string;
  id_number: string;
  category_name: string;
  request_product_id: string;
  document_id: string;
  is_parent: number;
  finding: boolean;
  elastic_index: string;
  category_id: number;
  product_id: number;
  name: string;
  id_type: string;
  position: number;
  request_id: string;
}
