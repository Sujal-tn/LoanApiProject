import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { LoanDealComponent } from './loan-deal';
import { LoandealService } from '../../services/loan-deal';

describe('LoanDealComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDealComponent],
      providers: [
        provideHttpClient(),
        {
          provide: LoandealService,
          useValue: {
            getPending: () => of({
              success: true,
              message: '',
              data: {
                items: [],
                page: 1,
                pageSize: 10,
                totalCount: 0,
                totalPages: 0,
                hasPreviousPage: false,
                hasNextPage: false
              }
            })
          }
        }
      ]
    }).compileComponents();
  });

  it('creates the loan deal page', () => {
    const fixture = TestBed.createComponent(LoanDealComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

});