import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export interface Post {
  id?: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Si quieres, extrae esto a environment.apiURL
  private API_URL = 'http://localhost:3000';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  private handleError(err: HttpErrorResponse) {
    console.error('API error', err);
    return throwError(() => new Error('Error en la comunicación con la API'));
  }

  getPosts(): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${this.API_URL}/posts`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getPost(id: number): Observable<Post> {
    return this.http
      .get<Post>(`${this.API_URL}/posts/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  createPost(post: Post): Observable<Post> {
    return this.http
      .post<Post>(`${this.API_URL}/posts`, JSON.stringify(post), this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http
      .put<Post>(`${this.API_URL}/posts/${id}`, JSON.stringify(post), this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deletePost(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/posts/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
