import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalComponent } from './vital.component';

describe('VitalComponent', () => {
  let component: VitalComponent;
  let fixture: ComponentFixture<VitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
