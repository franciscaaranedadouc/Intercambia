// src/app/apis/api-blog.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class ApiBlogService {
  private BASE = 'https://public-api.wordpress.com/rest/v1.1/sites/en.blog.wordpress.com/posts/';

  constructor(private http: HttpClient) {}

  getWpPosts(): Observable<Post[]> {
    return this.http
      .get<{ posts: any[] }>(this.BASE)
      .pipe(
        map(resp =>
          resp.posts.map(p => ({
            id:       p.ID,
            title:    p.title,
            excerpt:  p.excerpt,               // coincide con la interfaz
            date:     p.date,
            author:   p.author.name,
            image:    p.featured_image,
            category: p.tags?.[0]?.name.toLowerCase() || 'all'
          }))
        )
      );
  }
}
