import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SanctionComponent } from './sanction';
import { SanctionService } from '../../services/sanction';

describe('SanctionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SanctionComponent], providers: [{ provide: SanctionService, useValue: { getApprovedLoans: () => of({ success: true, message: '', data: { items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false } }) } }] }).compileComponents();
  });
  it('creates the sanction page', () => { const fixture = TestBed.createComponent(SanctionComponent); fixture.detectChanges(); expect(fixture.componentInstance).toBeTruthy(); });
});
