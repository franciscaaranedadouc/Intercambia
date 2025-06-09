import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

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
  standalone:false
})

export class BlogPage implements OnInit {
  // Segment for categories
  selectedCategory: 'all' | 'nutrition' | 'exercise' | 'lifestyle' = 'all';
  // Search query
  searchQuery: string = '';

  // All posts
  posts: BlogPost[] = [
    {
      id: 1,
      title: '5 Superalimentos para Potenciar tu Energía',
      image: 'assets/img/blog/featured.jpg',
      date: new Date(2025, 5, 8),
      author: 'María López',
      excerpt: 'Descubre cómo incorporar estos superalimentos en tu dieta diaria…',
      category: 'nutrition',
      featured: true
    },
    {
      id: 2,
      title: 'Rutina de Ejercicio Matutino para Principiantes',
      image: 'assets/img/blog/exercise.jpg',
      date: new Date(2025, 5, 6),
      author: 'Carlos Pérez',
      excerpt: 'Empieza tu día con energía siguiendo estos simples movimientos…',
      category: 'exercise'
    },
    {
      id: 3,
      title: 'Hábitos de Sueño para un Estilo de Vida Saludable',
      image: 'assets/img/blog/lifestyle.jpg',
      date: new Date(2025, 5, 4),
      author: 'Laura Gómez',
      excerpt: 'Dormir bien es clave. Aquí tienes 7 consejos para mejorar tu descanso…',
      category: 'lifestyle'
    },
    // … más posts …
  ];

  // Featured post (the one marked featured=true)
  featuredPost!: BlogPost;

  constructor(
    private menu: MenuController,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    // Close side menu if open
    this.menu.close('mainMenu');
    // Pick the first featured post, or fallback to the first post
    this.featuredPost =
      this.posts.find(p => p.featured) ?? this.posts[0];
  }

  // Compute posts filtered by category & search
  get filteredPosts(): BlogPost[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.posts
      .filter(p =>
        (this.selectedCategory === 'all' ||
         p.category === this.selectedCategory) &&
        (!q ||
         p.title.toLowerCase().includes(q) ||
         p.excerpt.toLowerCase().includes(q))
      );
  }

  // Navigate to the detailed post page
  openPost(postId: number) {
    this.navCtrl.navigateForward(`/tabs/blog/${postId}`);
  }
}






