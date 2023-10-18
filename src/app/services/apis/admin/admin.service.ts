import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private readonly httpClient: HttpClient) {}

  getAllPlansByUser(userId: string) {
    return this.httpClient.get<ApiResponse>(`${environment.apiAdmin}/plan/by/user/${userId}`);
  }

  getUserById(userId: string) {
    return this.httpClient.get<ApiResponse>(`${environment.apiAdmin}/user/${userId}`);
  }
}
