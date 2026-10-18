import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplyLoanService {
  http = inject(HttpClient);

  url = 'http://localhost:5087/api/ApplyLoan';

  getOptions() {
    return this.http.get<any>(this.url + '/options');
  }

  calculate(customerId: number, loanAmount: number, tenureYears: number) {
    return this.http.get<any>(
      this.url + '/calculate',
      {
        params: new HttpParams()
          .set('customerId', customerId)
          .set('loanAmount', loanAmount)
          .set('tenureYears', tenureYears)
      }
    );
  }

  applyLoan(data: any) {
    return this.http.post<any>(this.url + '/apply', data);
  }
}
export interface LoanApplication {
  customerId: number;
  dealId?: number;
  loanType: string;
  loanAmount: number;
  tenureMonths: number;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  emiDay: number;
  interestRate?: number;
  emiAmount?: number;
  currentStatus?: string;
  rejectionReason?: string | null;
  appliedDate?: string;
}