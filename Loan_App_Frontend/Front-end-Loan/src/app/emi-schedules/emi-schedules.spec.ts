import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmiSchedules } from './emi-schedules';

describe('EmiSchedules', () => {
  let component: EmiSchedules;
  let fixture: ComponentFixture<EmiSchedules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmiSchedules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmiSchedules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
