import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartCompComponent } from "./chart-comp/chart-comp.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChartCompComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'healthapp';
}
