import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ListResponse } from 'src/enum/list-response.enum';
import { CryptsService } from 'src/services/utils/crypts.service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class SessionGuard implements CanActivate {
  constructor(private CryptService: CryptsService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const session = this.CryptService.decryptData(ListResponse.SESSION);

    if (!session?.accessToken?.jwtToken) {
      return this.notAuthorized();
    }

    const tokenDecode: any = this.decodeToken(session?.accessToken?.jwtToken);

    if (!tokenDecode || tokenDecode?.token_use !== 'access') {
      return this.notAuthorized();
    }

    return true;
  }

  decodeToken(token: string): string {
    return jwt_decode(token);
  }

  notAuthorized() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigateByUrl('/login');
    return false;
  }
}
