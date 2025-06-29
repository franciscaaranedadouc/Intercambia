import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { ApiService, Post as ApiPost } from '../../endpoints/api.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

interface BlogPost {
  id: number;
  title: string;
  image: string;
  date: Date;
  author: string;
  excerpt: string;
  category: 'nutrition' | 'exercise' | 'lifestyle';
  featured?: boolean;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
  standalone: false,
})

export class BlogPage implements OnInit {
  selectedCategory: 'all' | 'nutrition' | 'exercise' | 'lifestyle' = 'all';
  searchQuery: string = '';

  // Ahora cargaremos esto desde la API
  posts: BlogPost[] = [];
  featuredPost!: BlogPost;

  constructor(
    private menu: MenuController,
    private navCtrl: NavController,
    private api: ApiService        // ← inyectamos el servicio
  ) {}

  ngOnInit(): void {
    this.menu.close('mainMenu');
    this.loadPosts();              // ← cargamos aquí
  }

  private loadPosts() {
    this.api.getPosts().subscribe({
      next: (apiPosts: ApiPost[]) => {
        // Mapear cada ApiPost a BlogPost
        this.posts = apiPosts.map(p => ({
          id: p.id!,
          title: p.title,
          image: 'assets/img/blog/default.jpg',   // o algún campo p.image si viene
          date: new Date(),                       // o p.date si lo trae tu db.json
          author: 'Autor Desconocido',            // puedes enriquecerlo luego
          excerpt: p.body.length > 100
            ? p.body.substring(0, 100) + '…'
            : p.body,
          category: 'lifestyle',                  // si tu API no trae categoría fija
          featured: false
        }));
        // Marcar el primero como destacado
        this.featuredPost = this.posts.find(p => p.featured) ?? this.posts[0];
      },
      error: err => {
        console.error('Error al cargar posts desde API', err);
        // Fallback: podrías cargar un array estático o mostrar mensaje
      }
    });
  }

  get filteredPosts(): BlogPost[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.posts.filter(p =>
      (this.selectedCategory === 'all' || p.category === this.selectedCategory) &&
      (!q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q))
    );
  }

  openPost(postId: number) {
    this.navCtrl.navigateForward(`/tabs/blog/${postId}`);
  }
}
