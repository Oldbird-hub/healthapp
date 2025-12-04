import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartCompComponent } from "./chart-comp/chart-comp.component";
import { VitalComponent } from "./vital/vital.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChartCompComponent, VitalComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'healthapp';
}
