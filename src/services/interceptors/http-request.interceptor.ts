import { Router } from '@angular/router';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, Observable, retry, throwError } from 'rxjs';
import { CryptsService } from '../utils/crypts.service';
import { ListResponse } from 'src/enum/list-response.enum';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private router: Router, private crypt: CryptsService) {}

  intercept(requestIn: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sessionToken = this.crypt.decryptData(ListResponse.SESSION);

    let requestOut = requestIn;

    if (sessionToken?.accessToken?.jwtToken) {
      requestOut = requestOut.clone({
        headers: requestOut.headers.set(
          'Authorization',
          `Bearer ${sessionToken.accessToken.jwtToken}`
        ),
      });
    }

    return next.handle(requestOut).pipe(
      retry({ count: 2, delay: 1000 }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('The Error'));
      }),
      finalize(() => {})
    );
  }
}
