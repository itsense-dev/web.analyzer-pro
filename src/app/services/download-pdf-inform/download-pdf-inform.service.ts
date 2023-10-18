import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PayloadPDF, ResponsePDF } from 'src/models/websocket-response.model';

@Injectable({
  providedIn: 'root',
})
export class DownloadPdfInformService {
  constructor(private http: HttpClient) {}
  downloadPdf(payload: PayloadPDF) {
    return this.http.post<ResponsePDF>(`${environment.api}/download-report`, payload);
  }
}
