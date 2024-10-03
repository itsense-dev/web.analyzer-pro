import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  Cities,
  Clients,
  CountryProducts,
  Idtypes,
  NewClient,
  Plan,
  ResponseGlobal,
  Rols,
  States,
  UserDetails,
  HistoryIndividualFilter,
  usersPlan,
  HistoryMassiveFilter,
  IndividualHistory,
  MassiveHistory,
  GlobalHistory,
  NewProduct,
  ResponseGlobal2,
  PersonType,
  Packages,
  NewPlan,
} from 'src/models/clientes.interface';
import { CalculatePackagePrice, PlanPackage } from 'src/models/package.model';
import { Countries, ResponseApiAnalyzer } from 'src/models/response-api-analyzer.interface';

@Injectable({
  providedIn: 'root',
})
export class AnalyzerProService {
  constructor(private http: HttpClient) {}

  getValidateUser() {
    return this.http.get<ResponseApiAnalyzer>(`${environment.api}/validateuser`);
  }
  getClientsList() {
    return this.http.get<ResponseGlobal<Clients[]>>(`${environment.apiAdmin}/client`);
  }
  setNewClient(payload: NewClient) {
    return this.http.post<ResponseGlobal<string>>(`${environment.apiAdmin}/client`, payload);
  }
  updateClient(clientId: number, payload: NewClient) {
    return this.http.put<ResponseGlobal<string>>(
      `${environment.apiAdmin}/client/${clientId}`,
      payload
    );
  }
  getAllPlans() {
    return this.http.get<ResponseGlobal<Plan[]>>(`${environment.apiAdmin}/plan/getall`);
  }
  getPlansByClient(clientId: number) {
    return this.http.get<ResponseGlobal<Plan[]>>(`${environment.apiAdmin}/plan/by/${clientId}`);
  }
  getClientById(searchClientId: number) {
    return this.http.get<ResponseGlobal<NewClient>>(
      `${environment.apiAdmin}/client/${searchClientId}`
    );
  }
  deleteClientById(clientId: number) {
    return this.http.delete<ResponseGlobal<string>>(`${environment.apiAdmin}/client/${clientId}`);
  }
  setClientState(clientId: number, clientState: string) {
    return this.http.put<ResponseGlobal<string>>(
      `${environment.apiAdmin}/client/${clientId}/isactive/${clientState}`,
      ''
    );
  }

  getUsersByClientByPlan(clientId: string, planId: number) {
    return this.http.get<ResponseGlobal<string>>(
      `${environment.apiAdmin}/user/by/client/${clientId}/and/plan/${planId}`
    );
  }
  setNewUser(payload: UserDetails) {
    return this.http.post<ResponseGlobal<string>>(`${environment.apiAdmin}/user`, payload);
  }
  updateUser(idUserEdit: string, payload: UserDetails) {
    return this.http.put<ResponseGlobal<string>>(
      `${environment.apiAdmin}/user/${idUserEdit}`,
      payload
    );
  }
  getUserById(userId: string) {
    return this.http.get<ResponseGlobal<UserDetails>>(`${environment.apiAdmin}/user/${userId}`);
  }
  deleteUserById(userId: string) {
    return this.http.delete<ResponseGlobal<string>>(`${environment.apiAdmin}/user/${userId}`);
  }
  setUserState(user_id: string, userState: string) {
    return this.http.put<ResponseGlobal<string>>(
      `${environment.apiAdmin}/user/${user_id}/ISACTIVE/${userState}`,
      {}
    );
  }
  getPlansByUsers(id_user: string) {
    return this.http.get<ResponseGlobal<usersPlan>>(
      `${environment.apiAdmin}/packages/by/user/${id_user}`
    );
  }
  getCountries() {
    return this.http.get<Countries>(`${environment.apiAdmin}/country`);
  }
  getCountriesWithProducts() {
    return this.http.get<ResponseGlobal<Countries[]>>(
      `${environment.apiAdmin}/country/with/products`
    );
  }
  getDepartmentsByCountry(CountryId: string) {
    return this.http.get<ResponseGlobal<States>>(`${environment.apiAdmin}/state/by/${CountryId}`);
  }
  getCityByDepartment(departmentId: number) {
    return this.http.get<ResponseGlobal<Cities>>(`${environment.apiAdmin}/city/by/${departmentId}`);
  }

  getCitiesByCountry(CountryId: string) {
    return this.http.get<ResponseGlobal<Cities>>(
      `${environment.apiAdmin}/city/by/country/${CountryId}`
    );
  }

  getIdTypes(country: number) {
    return this.http.get<ResponseGlobal<Idtypes[]>>(
      `${environment.apiAdmin}/id-type/by/${country}`
    );
  }
  getRols() {
    return this.http.get<ResponseGlobal<Rols>>(`${environment.apiAdmin}/role`);
  }
  getProductByCountry(countryId: string) {
    return this.http.get<ResponseGlobal<CountryProducts[]>>(
      `${environment.apiAdmin}/products/by/country/${countryId}`
    );
  }
  getIndividualHistoric(payload: HistoryIndividualFilter, page: number, size: number) {
    return this.http.post<ResponseGlobal<GlobalHistory<IndividualHistory[]>>>(
      `${environment.apiAdmin}/getHistory?page=${page}&size=${size}`,
      payload
    );
  }
  getMassiveHistoric(payload: HistoryMassiveFilter, page: number, size: number) {
    return this.http.post<ResponseGlobal<GlobalHistory<MassiveHistory[]>>>(
      `${environment.apiAdmin}/getHistory/massive?page=${page}&size=${size}`,
      payload
    );
  }
  createProduct(payload: NewProduct) {
    return this.http.post<ResponseGlobal2<string>>(`${environment.apiAdmin}/packages`, payload);
  }
  getPersonTypeByCountry(countryId: string) {
    return this.http.get<ResponseGlobal<PersonType[]>>(
      `${environment.apiAdmin}/id-type/by/${countryId}`
    );
  }
  getPackages() {
    return this.http.get<ResponseGlobal<Packages[]>>(`${environment.apiAdmin}/packages`);
  }
  getPackagesByPlan(planId: number) {
    return this.http.get<ResponseGlobal<PlanPackage[]>>(
      `${environment.apiAdmin}/packages/by/${planId}`
    );
  }
  createPlan(payload: NewPlan) {
    return this.http.post<ResponseGlobal2<string>>(`${environment.apiAdmin}/plan`, payload);
  }
  calculatePricePackages(payload: CalculatePackagePrice[]) {
    return this.http.post<ResponseGlobal<any>>(`${environment.apiAdmin}/packages/calculate_price`, {
      package_list_pricing: payload,
    });
  }
  createSubscription(payload: any) {
    return this.http.post<ResponseGlobal<any>>(
      `${environment.apiAdmin}/subscription/create`,
      payload
    );
  }
}
