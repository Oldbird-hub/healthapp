import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Subscription } from 'rxjs';
import { EcgSocketService } from '../ecg-socket.service';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-chart-comp',
  standalone: true,
  imports: [],
  templateUrl: './chart-comp.component.html',
  styleUrl: './chart-comp.component.scss'
})
export class ChartCompComponent implements OnInit, AfterViewInit, OnDestroy{
   @ViewChild('ecgCanvas') ecgCanvas!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;
  private ecgSub?: Subscription;

  constructor(private ecgSocketService: EcgSocketService) {

  }

  ngOnInit(): void {
    this.ecgSocketService.connect();
  }

  ngAfterViewInit(): void {
    const ctx = this.ecgCanvas.nativeElement.getContext('2d');

    if (!ctx) {
      console.error('Δεν βρέθηκε context για το canvas');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'ECG',
            data: [],
            borderWidth: 2,
            borderColor: 'rgb(0, 180, 0)',
            pointRadius: 0,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          x: {
            display: false,
          },
          y: {
            beginAtZero: false,
            suggestedMin: -1,
            suggestedMax: 2,
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });

    // 🔴 Εδώ συνδεόμαστε στο stream
    this.ecgSub = this.ecgSocketService.getEcgStream().subscribe((value) => {
      this.addPoint(value);
    });
  }

  // απλά demo δεδομένα ECG (μπορείς να τα αντικαταστήσεις με πραγματικά)
  private ecgData: number[] = [
    0, 0.1, 0.2, 0.1, 0, -0.1, -0.2, 0, 1, 0.3, 0, -0.1, 0, 0.1, 0
  ];

  // ngAfterViewInit(): void {
  //   const ctx = this.ecgCanvas.nativeElement.getContext('2d');

  //   if (!ctx) {
  //     console.error('Δεν βρέθηκε context για το canvas');
  //     return;
  //   }

  //   this.chart = new Chart(ctx, {
  //     type: 'line',
  //     data: {
  //       labels: this.ecgData.map((_, i) => i.toString()),
  //       datasets: [
  //         {
  //           label: 'ECG',
  //           data: this.ecgData,
  //           borderWidth: 2,
  //           borderColor: 'rgb(0, 180, 0)',
  //           pointRadius: 0,
  //           tension: 0.3, // λίγο smoothing
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       animation: false,
  //       scales: {
  //         x: {
  //           display: false,
  //         },
  //         y: {
  //           beginAtZero: false,
  //           suggestedMin: -1,
  //           suggestedMax: 2,
  //         },
  //       },
  //       plugins: {
  //         legend: { display: false },
  //       },
  //     },
  //   });
  // }

  private addPoint(value: number) {
    const maxPoints = 200;

    this.chart.data.labels!.push('');
    (this.chart.data.datasets[0].data as number[]).push(value);

    if (this.chart.data.labels!.length > maxPoints) {
      this.chart.data.labels!.shift();
      (this.chart.data.datasets[0].data as number[]).shift();
    }

    this.chart.update('none');
  }

  ngOnDestroy(): void {
    this.ecgSub?.unsubscribe();
  }

}
