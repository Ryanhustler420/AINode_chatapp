import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASEURL = `http://localhost:3000/api/chatapp/v1`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  /**
   *
   * @param body consist of the user credential object which we'll pass through this parameter
   * this route is for creating new user
   */
  registerUser(body): Observable<any> {
    return this.http.post(`${BASEURL}/register`, body);
  }

  /**
   *
   * @param body consist of the user credential object which we'll pass through this parameter
   * this route is for login existing user
   */

  loginUser(body): Observable<any> {
    return this.http.post(`${BASEURL}/login`, body);
  }
}
