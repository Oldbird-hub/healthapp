import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCompComponent } from './chart-comp.component';

describe('ChartCompComponent', () => {
  let component: ChartCompComponent;
  let fixture: ComponentFixture<ChartCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartCompComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
