export interface WebsocketResponse {
  id: string;
  client_info: ClientInformation;
  product_count: number;
  connection_id: string;
  load_massive_document_id: string;
  search_date: string;
  search_param: SearchParams;
  detail: DetailCrawler[];
  indexname: string;
  document_id: string;
}

export interface DetailCrawler {
  detail_type_code: string;
  product_url: string;
  parent_id: string | number;
  product_id: number;
  request_product_id: string;
  position: number;
  is_parent: number;
  fields: string;
  body?: BodyDetailCrawler;
  product_name: string;
  statusCode: number;
}

export interface BodyDetailCrawler {
  date: string;
  countryCode: string;
  name: string;
  time: string;
  message?: string;
  url: string;
  request_detail: RequestDetail;
}
export interface ClientInformation {
  identification_type: string;
  document_number: string;
  company_name: string;
  email: string;
  user_name: string;
}

export interface RequestDetail {
  country: string;
  id_number: string;
  request_product_id: string;
  product_id: number;
  name: string;
  id_type: string;
  position: number;
  document_id: string;
  is_parent: number;
  request_id: string;
  elastic_index: string;
}

export interface SearchParams {
  country: string;
  id_type: string;
  id_number: string;
  name: string;
}

export interface PayloadPDF {
  index: string;
  document_id: string;
}

export interface ResponsePDF {
  body: {
    pdfLink: string;
  };
  statusCode: number;
}
