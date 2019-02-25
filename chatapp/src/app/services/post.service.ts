import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASEURL = `http://localhost:3000/api/chatapp/v1`;

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) {}
  /**
   *
   * @param body must be always an object. this will content post data
   *
   */

  addPost(body): Observable<any> {
    return this.http.post(`${BASEURL}/post/add-post`, body);
  }

  getAllPosts(): Observable<any> {
    return this.http.get(`${BASEURL}/posts`);
  }

  addLike(id): Observable<any> {
    return this.http.post(`${BASEURL}/post/add-like`, id);
  }

  addComment(postId, comment): Observable<any> {
    return this.http.post(`${BASEURL}/post/add-comment`, {
      postId,
      comment
    });
  }

  getPost(idOfPost): Observable<any> {
    return this.http.get(`${BASEURL}/post/${idOfPost}`);
  }
}
