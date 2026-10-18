import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApplyLoanService } from './apply-loan';

describe('ApplyLoanService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideHttpClient()] }));
  it('is created', () => expect(TestBed.inject(ApplyLoanService)).toBeTruthy());
});
