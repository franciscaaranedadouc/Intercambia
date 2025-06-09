import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { MenuController } from '@ionic/angular';

interface PortionGroup {
  id: string;
  name: string;
  allotted: number;
  selectedItems: number[];
  items: { label: string; grams: number }[];
}

interface Section {
  type: string;
  title: string;
  data: any;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  // 0) Usuario
  nombre = 'Usuario';
  email = '';
  password = '';

  // 1) Porciones
  portionGroups: PortionGroup[] = [
    {
      id: 'frutas',
      name: 'Frutas',
      allotted: 2,
      selectedItems: [],
      items: [
        { label: '1 manzana', grams: 100 },
        { label: '1 naranja', grams: 120 },
        { label: '½ plátano', grams: 60 },
        { label: '1 taza frutillas', grams: 200 },
      ],
    },
    {
      id: 'vegetales',
      name: 'Vegetales',
      allotted: 3,
      selectedItems: [],
      items: [
        { label: '½ taza brócoli', grams: 80 },
        { label: '1 taza espinacas', grams: 30 },
        { label: '1 zanahoria', grams: 70 },
      ],
    },
    {
      id: 'lacteos',
      name: 'Lácteos',
      allotted: 2,
      selectedItems: [],
      items: [
        { label: '1 vaso leche', grams: 240 },
        { label: '1 yogurt', grams: 125 },
        { label: '30 g queso fresco', grams: 30 },
      ],
    },
  ];

  // 2) Requerimientos diarios
  dailyKcal    = 1947;
  dailyProtein = 267;
  dailyCarbs   = 267;
  dailyFat     = 70;
  dailyWater   = 2.3;

  // 3) Secciones de comida/ejercicio/agua
  sections: Section[] = [
    { type: 'breakfast', title: 'Desayuno', data: { calories: 0, protein: 0, carbs: 0, fat: 0 } },
    { type: 'lunch',     title: 'Almuerzo', data: { calories: 0, protein: 0, carbs: 0, fat: 0 } },
    { type: 'dinner',    title: 'Cena',     data: { calories: 0, protein: 0, carbs: 0, fat: 0 } },
    { type: 'snacks',    title: 'Snacks',   data: { calories: 0, protein: 0, carbs: 0, fat: 0 } },
    { type: 'exercise',  title: 'Ejercicio',data: { calories: 0, type: 'Sedentario' } },
    { type: 'water',     title: 'Agua',     data: { intake: 0, goal: this.dailyWater } },
  ];

  // Iconos para agua
  waterCups = Array(6).fill(0).map(() => ({ filled: false }));

  // Progreso semanal (mock)
  weekArray = [true, true, true, false, false, false, false];
  streak = 3;

  constructor(
    private route: ActivatedRoute,
    private menu: MenuController
  ) {}

  ngOnInit() {
    this.menu.close('mainMenu');
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.password = params['password'] || '';
      this.nombre = this.email ? this.email.split('@')[0] : 'Usuario';
    });
  }

  /** Total de porciones */
  get selectedTotal(): number {
    return this.portionGroups.reduce((sum, g) => sum + g.selectedItems.length, 0);
  }

  /** Meta diaria de porciones */
  get dailyGoal(): number {
    return this.portionGroups.reduce((sum, g) => sum + g.allotted, 0);
  }

  /** Alterna selección de porción */
  togglePortion(groupIndex: number, itemIndex: number) {
    const group = this.portionGroups[groupIndex];
    const idx = group.selectedItems.indexOf(itemIndex);
    if (idx > -1) {
      group.selectedItems.splice(idx, 1);
    } else if (group.selectedItems.length < group.allotted) {
      group.selectedItems.push(itemIndex);
    }
  }

  /** Obtiene la sugerencia actual */
  get currentSuggestion() {
    for (let gi = 0; gi < this.portionGroups.length; gi++) {
      const g = this.portionGroups[gi];
      if (g.selectedItems.length < g.allotted) {
        const next = g.items.findIndex((_, idx) => !g.selectedItems.includes(idx));
        if (next > -1) {
          return {
            groupIndex: gi,
            itemIndex: next,
            groupName: g.name,
            item: g.items[next]
          };
        }
      }
    }
    return null;
  }

  /** Añade o quita la sugerencia */
  doSwap() {
    const sug = this.currentSuggestion;
    if (sug) {
      this.togglePortion(sug.groupIndex, sug.itemIndex);
    }
  }

  /** Ver todas las opciones (pendiente) */
  seeMore() {
    // navegar a pantalla detallada
  }

  /** Añade una entrada en la sección indicada */
  addEntry(sectionType: string) {
    switch (sectionType) {
      case 'breakfast':
      case 'lunch':
      case 'dinner':
      case 'snacks':
        // abrir modal o página para añadir comida
        break;

      case 'exercise':
        // abrir selector de ejercicio
        break;

      case 'water':
        // llena el siguiente vaso de agua
        const cup = this.waterCups.find(c => !c.filled);
        if (cup) cup.filled = true;
        break;
    }
  }
}
