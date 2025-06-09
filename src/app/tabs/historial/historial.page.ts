import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface WeightEntry {
  date: Date;
  weight: number;
  fat: number;
  muscle: number;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false
})
export class HistorialPage implements OnInit, AfterViewInit {

  @ViewChild('weightChart', { static: false })
  weightChartRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('zoomChart', { static: false })
  zoomChartRef!: ElementRef<HTMLCanvasElement>;

  isChartZoomed = false;

  private chartInstance: any = null; // para el gráfico normal
  private zoomChartInstance: any = null; // para el gráfico ampliado

  // Datos para el gráfico
  weightHistory: WeightEntry[] = [];
  weekArray: boolean[] = [true, true, false, true, true, false, true];
  streak: number = 0;
  targetWeight = 72;
  averageWeight = 0;
  daysAboveGoal = 0;
  daysBelowGoal = 0;

  constructor(private menu: MenuController) {}

  ngOnInit() {
    this.menu.close('mainMenu');

    // Poblar weightHistory con fechas y valores aleatorios
    const dayMs = 24 * 60 * 60 * 1000;
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * dayMs);
      const weight = parseFloat((70 + Math.random() * 4).toFixed(1));
      const fat = parseFloat((18 + Math.random() * 5).toFixed(1));
      const muscle = parseFloat((35 + Math.random() * 4).toFixed(1));
      this.weightHistory.push({ date, weight, fat, muscle });
    }

    this.streak = this.weekArray.filter(d => d).length;
    this.computeStats();
  }

  ngAfterViewInit() {
    this.renderWeightChart(false); // renderiza el gráfico normal
  }

  // Abrir el modal con el gráfico ampliado
  openChartZoom() {
    this.isChartZoomed = true;
    // Espera a que el canvas esté en el DOM antes de renderizar
    setTimeout(() => this.renderWeightChart(true), 100);
  }

  // Cerrar el modal
  closeChartZoom() {
    this.isChartZoomed = false;
    // Opcional: destruye el gráfico ampliado al cerrar para liberar memoria
    if (this.zoomChartInstance) {
      this.zoomChartInstance.destroy();
      this.zoomChartInstance = null;
    }
  }

  // Calcula estadísticas mensuales
  private computeStats() {
    const weights = this.weightHistory.map(h => h.weight);
    this.averageWeight = parseFloat(
      (
        weights.reduce((sum, w) => sum + w, 0) /
        weights.length
      ).toFixed(1)
    );
    this.daysAboveGoal = weights.filter(w => w > this.targetWeight).length;
    this.daysBelowGoal = weights.filter(w => w < this.targetWeight).length;
  }

  // Renderiza el gráfico, normal o ampliado según parámetro
  private renderWeightChart(zoom = false) {
    let canvasRef = zoom ? this.zoomChartRef : this.weightChartRef;
    if (!canvasRef || !canvasRef.nativeElement) return;

    // Destruye el gráfico anterior si existe
    if (zoom && this.zoomChartInstance) {
      this.zoomChartInstance.destroy();
    }
    if (!zoom && this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = canvasRef.nativeElement.getContext('2d')!;
    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.weightHistory.map(h =>
          h.date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })
        ),
        datasets: [
          {
            label: 'Peso (kg)',
            data: this.weightHistory.map(h => h.weight),
            fill: false,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2,
          },
          {
            label: '% Grasa',
            data: this.weightHistory.map(h => h.fat),
            fill: false,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2,
            yAxisID: 'y2',
          },
          {
            label: '% Músculo',
            data: this.weightHistory.map(h => h.muscle),
            fill: false,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2,
            yAxisID: 'y2',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 }
          },
          y: {
            beginAtZero: false,
            title: { display: true, text: 'Peso (kg)' }
          },
          y2: {
            beginAtZero: false,
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: '% Grasa / % Músculo' }
          }
        },
        plugins: {
          legend: { display: true }
        }
      }
    });

    if (zoom) {
      this.zoomChartInstance = chartInstance;
    } else {
      this.chartInstance = chartInstance;
    }
  }
}
