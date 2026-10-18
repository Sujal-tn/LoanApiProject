import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DisbursementComponent } from './disbursement';
import { DisbursementService } from '../../services/disbursement';
const page = { items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false };
describe('DisbursementComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DisbursementComponent], providers: [{ provide: DisbursementService, useValue: { getPending: () => of({ success: true, message: '', data: page }), getAll: () => of({ success: true, message: '', data: page }) } }] }).compileComponents();
  });
  it('creates the disbursement page', () => { const fixture = TestBed.createComponent(DisbursementComponent); fixture.detectChanges(); expect(fixture.componentInstance).toBeTruthy(); });
});
