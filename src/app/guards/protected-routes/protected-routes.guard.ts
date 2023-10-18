import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  NavigationEnd,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, filter } from 'rxjs';
import { ListResponse } from 'src/enum/list-response.enum';
import { SafetyMesh } from 'src/models/safety-mesh.model';
import { CryptsService } from 'src/services/utils/crypts.service';

@Injectable({
  providedIn: 'root',
})
export class ProtectedRoutesGuard implements CanActivate {
  constructor(private CryptService: CryptsService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const session = this.CryptService.decryptData(ListResponse.USER);
    const safetyMesh: SafetyMesh[] = session.SafetyMesh;
    /* let canViewRoute: boolean = false;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const currentRoute = event.url?.split('/');

        for (const key in session.safety_mesh) {
          if (Object.prototype.hasOwnProperty.call(session.safety_mesh, key)) {
            const safetyUrl = session.safety_mesh[key].url?.split('/');
            if (currentRoute[1] === safetyUrl[1]) canViewRoute = true;
          }
        }
      }); 

    );*/

    /* this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const currentRoute = event.url;

        console.log(currentRoute);
        console.log(safetyMesh);
        const canViewRoute = safetyMesh.filter((item) => item?.url === currentRoute);
        console.log(canViewRoute);
      });
 */
    return true;
  }
}
