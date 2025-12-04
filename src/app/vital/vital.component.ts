import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EcgSocketService, VitalsData } from '../ecg-socket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vital',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vital.component.html',
  styleUrl: './vital.component.scss'
})
export class VitalComponent implements OnDestroy {
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
