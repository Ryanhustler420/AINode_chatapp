import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:3000/api/chatapp/v1';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {}

  GetAllUsers(): Observable<any> {
    return this.http.get(`${BASE_URL}/users`);
  }

  // this is also possibe here you have to use '.then' method
  // async GetAllUsers() {
  //   return await this.http.get(`${BASE_URL}/users`);
  // }
}
