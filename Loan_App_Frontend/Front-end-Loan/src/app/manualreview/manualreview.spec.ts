import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Manualreview } from './manualreview';

describe('Manualreview', () => {
  let component: Manualreview;
  let fixture: ComponentFixture<Manualreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Manualreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Manualreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
