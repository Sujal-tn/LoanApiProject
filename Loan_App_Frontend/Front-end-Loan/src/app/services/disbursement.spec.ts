import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { DisbursementService } from './disbursement';

describe('DisbursementService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideHttpClient()] }));
  it('is created', () => expect(TestBed.inject(DisbursementService)).toBeTruthy());
});
