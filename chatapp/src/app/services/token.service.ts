import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private cookieService: CookieService) {}

  setToken(token) {
    this.cookieService.set('chatapp_token', token);
  }

  getToken() {
    this.cookieService.get('chatapp_token');
  }

  deleteToken() {
    this.cookieService.delete('chatapp_token');
  }
}
