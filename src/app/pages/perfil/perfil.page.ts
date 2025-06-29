import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface HealthEntry {
  name: string;
  details: string;
  icon: string;
  critical: boolean;
}

interface WeightEntry {
  date: Date;
  weight: number;
}

interface User {
  avatarUrl?: string;
  name: string;
  email: string;
  weight: number;
  objective: 'lose' | 'gain' | 'maintain';
  plan: { name: string; type: 'basic' | 'premium' | 'pro' };
  weightHistory: WeightEntry[];
  healthHistory: HealthEntry[];
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {

  user: User = {
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    weight: 72,
    objective: 'maintain',
    plan: { name: 'Premium', type: 'premium' },
    weightHistory: [
      { date: new Date(2025, 5, 1), weight: 72 },
      { date: new Date(2025, 4, 15), weight: 73 },
      { date: new Date(2025, 3, 30), weight: 74 },
    ],
    healthHistory: [
      {
        name: 'Hipertensión',
        details: 'Diagnóstico en 2023 – control con dieta',
        icon: 'trending-up-outline',
        critical: true
      },
      {
        name: 'Alergia al polen',
        details: 'Estacional, marzo-abril',
        icon: 'flower-outline',
        critical: false
      },
    ]
  };

  weekArray = [true, false, true, true, false, true, false];
  streak = 4;

  constructor() { }

  ngOnInit() {
    // this.menu.close('mainMenu');
  }

  savePersonal() {
    console.log('Guardando personal:', {
      weight: this.user.weight,
      objective: this.user.objective
    });
  }

  changePlan() {
    console.log('Cambiando plan a:', this.user.plan.type);
    this.user.plan.name = this.user.plan.type.charAt(0).toUpperCase() +
      this.user.plan.type.slice(1);
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.user.avatarUrl = image.dataUrl;
    } catch (error) {
      console.error('Error al tomar foto:', error);
    }
  }

}
