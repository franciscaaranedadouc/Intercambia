// src/app/tabs/recetas/recetas.page.ts

import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';


interface Recipe {
  id: number;
  title: string;
  image: string;
  shortDesc: string;
  calories: number;
  protein: number;
  carbs: number;
  water: number;
  objectives: Array<'lose' | 'gain' | 'maintain'>;
}

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
  standalone:false,
})
export class RecetasPage implements OnInit {
  // Segmento de objetivo
  selectedObjective: 'lose' | 'gain' | 'maintain' = 'lose';

  // Texto de búsqueda
  searchText: string = '';

  // Listado completo de recetas
  recipes: Recipe[] = [
    {
      id: 1,
      title: 'Ensalada de Quinoa',
      image: 'assets/img/quinoa.png',
      shortDesc: 'Con tomate, pepino y aguacate para un almuerzo ligero.',
      calories: 350,
      protein: 12,
      carbs: 45,
      water: 150,
      objectives: ['lose', 'maintain']
    },
    {
      id: 2,
      title: 'Pollo al Curry Fit',
      image: 'assets/img/pollo-curry.png',
      shortDesc: 'Pechuga de pollo con verduras y curry suave.',
      calories: 450,
      protein: 35,
      carbs: 30,
      water: 100,
      objectives: ['gain', 'maintain']
    },
    {
      id: 3,
      title: 'Smoothie Verde Detox',
      image: 'assets/img/smoothie-verde.png',
      shortDesc: 'Espinaca, manzana verde y jengibre para depurar.',
      calories: 250,
      protein: 5,
      carbs: 55,
      water: 200,
      objectives: ['lose']
    },
    // … añadir más recetas …
  ];

  // Recetas destacadas (por ejemplo, las tres primeras)
  featuredRecipes: Recipe[] = this.recipes.slice(0, 3);

  constructor(
    private menu: MenuController,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    this.menu.close('mainMenu');
  }

  // Filtra las recetas según objetivo y texto de búsqueda
  get filteredRecipes(): Recipe[] {
    const search = this.searchText.toLowerCase();
    return this.recipes.filter(r =>
      r.objectives.includes(this.selectedObjective) &&
      (!search ||
       r.title.toLowerCase().includes(search) ||
       r.shortDesc.toLowerCase().includes(search))
    );
  }

  // Navega a la página de detalle de receta
  openRecipe(id: number) {
    // Ajusta la ruta según tu configuración de rutas
    this.navCtrl.navigateForward(`/recetas/${id}`);
  }
}
