import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ListResponse } from 'src/enum/list-response.enum';
import { CryptsService } from 'src/services/utils/crypts.service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private router: Router, private cryptService: CryptsService) {}

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  getUser() {
    const session = this.cryptService.decryptData(ListResponse.SESSION);
    const tokenDecode = this.decodeToken(session?.idToken?.jwtToken);
    return tokenDecode;
  }

  decodeToken(token: string): string {
    return jwt_decode(token);
  }

  getSession() {
    return this.cryptService.decryptData(ListResponse.USER);
  }
}
