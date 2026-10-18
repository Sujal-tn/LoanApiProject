import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { SanctionService } from './sanction';

describe('SanctionService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideHttpClient()] }));
  it('is created', () => expect(TestBed.inject(SanctionService)).toBeTruthy());
});
