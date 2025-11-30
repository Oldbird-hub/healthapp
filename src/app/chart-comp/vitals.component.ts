// vitals.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcgSocketService, VitalsData } from '../ecg-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vitals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vitals.component.html',
  styleUrls: ['./vitals.component.css'],
})
export class VitalsComponent implements OnInit, OnDestroy {
  heartRate: number | null = null;
  spo2: number | null = null;

  private sub?: Subscription;

  constructor(private ecgSocketService: EcgSocketService) {}

  ngOnInit(): void {
    this.ecgSocketService.connect();

    this.sub = this.ecgSocketService.getVitalsStream().subscribe(
      (data: VitalsData) => {
        this.heartRate = data.heartRate;
        this.spo2 = data.spo2;
      }
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
