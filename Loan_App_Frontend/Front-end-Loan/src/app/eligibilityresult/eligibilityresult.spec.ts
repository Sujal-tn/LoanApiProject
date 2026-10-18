import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityResult } from './eligibilityresult';

describe('EligibilityResult', () => {
  let component: EligibilityResult;
  let fixture: ComponentFixture<EligibilityResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EligibilityResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EligibilityResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
