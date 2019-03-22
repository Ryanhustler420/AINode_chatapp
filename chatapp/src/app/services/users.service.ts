import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:3000/api/chatapp/v1';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  GetAllUsers(): Observable<any> {
    return this.http.get(`${BASE_URL}/users`);
  }

  GetUserById(id): Observable<any> {
    return this.http.get(`${BASE_URL}/users/${id}`);
  }

  GetUserByName(username): Observable<any> {
    return this.http.get(`${BASE_URL}/users_with/${username}`);
  }

  // this is also possibe here you have to use '.then' method
  // async GetAllUsers() {
  //   return await this.http.get(`${BASE_URL}/users`);
  // }

  FollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASE_URL}/follow-user`, { userFollowed });
  }

  UnFollowUser(userUnFollowed): Observable<any> {
    return this.http.post(`${BASE_URL}/unfollow-user`, { userUnFollowed });
  }

  MarkNotification(notificationId): Observable<any> {
    return this.http.post(`${BASE_URL}/mark/${notificationId}`, { notificationId });
  }

  DeleteNotification(notificationId): Observable<any> {
    return this.http.post(`${BASE_URL}/delete/${notificationId}`, { notificationId });
  }

  MarkAllAsRead(): Observable<any> {
    return this.http.post(`${BASE_URL}/mark-all`, { all: true });
  }

  AddImage(image): Observable<any> {
    return this.http.post(`${BASE_URL}/upload-image`, { image });
  }

  SetDefaultImage(imageId, imageVersion): Observable<any> {
    return this.http.post(`${BASE_URL}/set-default-image`, { imageId, imageVersion });
  }

  ProfileNotifications(id): Observable<any> {
    return this.http.get(`${BASE_URL}/user/view-profile/${id}`);
  }
}
