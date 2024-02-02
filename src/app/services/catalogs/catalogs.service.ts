import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseGlobal } from 'src/models/clientes.interface';

@Injectable({
  providedIn: 'root',
})
export class CatalogsService {
  constructor(private http: HttpClient) {}

  getCatalog(catalog: string) {
    return this.http.get<ResponseGlobal<any>>(
      `${environment.apiAdmin}/catalogue/entity/${catalog}`
    );
  }

  getSubscriptionType() {
    return this.http.get<ResponseGlobal<any>>(`${environment.apiAdmin}/subscription-type`);
  }

  getsubscriptionTime() {
    return this.http.get<ResponseGlobal<any>>(`${environment.apiAdmin}/time/range`);
  }
}
