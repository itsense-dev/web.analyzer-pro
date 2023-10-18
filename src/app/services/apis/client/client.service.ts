import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/models/api-response.model';
import { QueryLoadMassive } from 'src/models/load-massive.model';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {}

  getPackagesBySubscription(subscriptionId: string) {
    return this.http.get<ApiResponse>(
      `${environment.apiAdmin}/plan/detail/subscription/${subscriptionId}`
    );
  }

  createQueryLoadMassive(payload: QueryLoadMassive) {
    return this.http.post<ApiResponse>(`${environment.api}/load-massive/create-query`, payload);
  }

  getMassiveQueryHistory(page: number, size: number) {
    return this.http.get<ApiResponse>(`${environment.api}/load-massive/my-queries`, {
      params: {
        page: page,
        size: size,
      },
    });
  }

  getMassiveQueryTemplate(personType: number, countryId: string) {
    return this.http.get<ApiResponse>(`${environment.api}/load-massive/generate-template`, {
      params: {
        'person-type': personType,
        'country-id': countryId,
      },
    });
  }

  saveMassiveConnection(connectionId: string) {
    const payload = { massive_connection_id: connectionId };
    return this.http.post<ApiResponse>(`${environment.api}/load-massive/save-connection`, payload);
  }
}
