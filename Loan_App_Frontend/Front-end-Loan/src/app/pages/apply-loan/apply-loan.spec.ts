import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApplyLoanComponent } from './apply-loan';
import { ApplyLoanService } from '../../services/apply-loan';

describe('ApplyLoanComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyLoanComponent],
      providers: [{ provide: ApplyLoanService, useValue: {
        getOptions: () => of({ loanTypes: [], tenures: [], emiDates: [] }),
        calculate: () => of({ interestRate: 11, emiAmount: 1000 }),
        applyLoan: () => of({ success: true, message: 'submitted', data: null })
      }}]
    }).compileComponents();
  });
  it('creates the Apply Loan page', () => {
    const fixture = TestBed.createComponent(ApplyLoanComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
