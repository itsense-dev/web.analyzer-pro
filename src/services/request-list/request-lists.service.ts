import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RequestList } from 'src/models/request.interface';
import { ResponseList } from 'src/models/response-list.model';

@Injectable({
  providedIn: 'root',
})
export class RequestListsService {
  constructor(private http: HttpClient) {}

  lists(payload: RequestList) {
    return this.http.post<ResponseList>(`${environment.api}/fuentes_global`, payload);
  }

  /*  getListResult(payload: any) {
    return this.http.post<any>(environment.apiGetRquests, payload);
  } */

  refreshSources(documentId: string, index: string) {
    const payload = { document_id: documentId, index: index };
    return this.http.post<any>(`${environment.api}/failures-manager`, payload);
  }

  //ToDo Test
  getDocumentTypeByCountry(country: string) {
    return this.http.get<any>(`${environment.apiAdmin}/id-type/by/${country}`);
  }
}
