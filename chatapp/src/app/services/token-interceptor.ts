import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

/**
 *  This Service is play role of injection in API calls. each call you make. this class will inject cookie token into request
 *  so you will be verified by the backend. this class is kinda watchman in the middle of the service.
 */

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // return next.handle(req);
    const headersConfig = {
      'Content-Type': 'Application/json',
      Accept: 'apllication/json'
    };
    const token = this.tokenService.getToken();
    if (token) {
      headersConfig['Authorization'] = `bearer ${token}`;
    }
    const _req = req.clone({ setHeaders: headersConfig });
    return next.handle(_req);
  }
}
