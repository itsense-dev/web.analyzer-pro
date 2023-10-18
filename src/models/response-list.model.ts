export interface ResponseList {
  statusCode: number;
  id: string;
  eventId: string;
  message: string;
  detail: Detail[];
  indexname: string;
  document_id: string;
}

export interface Detail {
  statusCode: number;
  body: any;
}

export interface List {
  statusCode: number;
  body: BodyList;
  message: any;
}

export interface BodyList {
  countryCode: string;
  date: string;
  message: string | object | [];
  name: string;
  time: string;
  url: string;
}
