import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GenerateCertificateLinkedIn,
  PayloadGetAttemps,
} from 'src/app/components/public/andicom/models/andicom.interface';
import { environment } from 'src/environments/environment';
import { ResponseGlobal } from 'src/models/clientes.interface';

@Injectable({
  providedIn: 'root',
})
export class AndicomService {
  constructor(private http: HttpClient) {}

  getAtempsByIdTypeAndNumber(payload: PayloadGetAttemps) {
    return this.http.post<ResponseGlobal<any>>(
      `${environment.apiAndicom}/lead/get-by-id-num`,
      payload
    );
  }

  increaseAtempsByIdTypeAndNumber(payload: PayloadGetAttemps) {
    return this.http.put<ResponseGlobal<any>>(
      `${environment.apiAndicom}/lead/increase-attempts`,
      payload
    );
  }

  getCertificate(payload: GenerateCertificateLinkedIn) {
    return this.http.post<any>(`${environment.apiAndicom}/generate-certificate`, payload);
  }
}
